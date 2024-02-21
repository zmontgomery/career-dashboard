package com.senior.project.backend.artifact;

import com.senior.project.backend.domain.Artifact;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.SecurityUtil;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.core.io.Resource;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.Optional;

@Service
public class ArtifactService {

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    @Value("${FILE_UPLOAD_DIRECTORY:}")
    private String _uploadDirectory;

    private final String uploadDirectory;

    private final ArtifactRepository artifactRepository;

    public ArtifactService(ArtifactRepository artifactRepository) {
        this.artifactRepository = artifactRepository;
        if (this._uploadDirectory == null) {
            // Get the absolute path of the project directory
            Path projectDirectory = new FileSystemResource("").getFile().getAbsoluteFile().getParentFile().toPath();

            // Get new upload directory location in the project root
            this.uploadDirectory = projectDirectory.resolve("uploads").toString();
        } else {
            this.uploadDirectory = this._uploadDirectory;
        }
    }

    /**
     * Finds an artifact by its id
     */
    public Mono<Artifact> findById(int id) {
        Optional<Artifact> artifact =  artifactRepository.findById((long) id);
        if (artifact.isPresent()) {
            return Mono.just(artifact.get());
        }
        return Mono.empty();
    }

    /**
     * Finds an artifact by its unique UUID generated filename from the database
     */
    public Mono<Artifact> findByUniqueFilename(String filename) {
        Optional<Artifact> artifact =  artifactRepository.findByUniqueIdentifier(filename);
        if (artifact.isPresent()) {
            return Mono.just(artifact.get());
        }
        return Mono.empty();
    }

    /**
     * Stores a file in the uploads folder and adds an artifact object to the database
     */
    public Mono<Integer> processFile(FilePart filePart) {
        return validateFileSize(filePart).flatMap(
            (result) -> {
                String extension;
                // Check if the file is a PDF based on content type
                MediaType contentType = filePart.headers().getContentType();
                if (contentType == null) {
                    return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "No Content type provided for file"));
                } else if (contentType.isCompatibleWith(MediaType.APPLICATION_PDF)){
                    extension = ".pdf";
                }
                // Add more file types here
                else {
                    return Mono.error(new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported filetype"));
                }

                // Generate a unique identifier for the file
                String uniqueFilename = UUID.randomUUID() + extension;

                // Construct the destination path using the unique identifier
                Path destination = Paths.get(uploadDirectory, uniqueFilename);

                Artifact upload = new Artifact();
                upload.setFileLocation(destination.toString());
                upload.setName(filePart.filename());

                // Save the file to the specified directory
                return filePart.transferTo(destination)
                        .then(SecurityUtil.getCurrentUser())
                        .map((user) -> {
                            upload.setUserId(user.getId());
                            return upload;
                        })
                        .flatMap((artifact) -> Mono.just(artifactRepository.save(artifact)))
                        .flatMap((artifact) -> findByUniqueFilename(artifact.getFileLocation()))
                        .map((artifact) -> artifact.getId());
            }
        );
    }

    /**
     * Deletes a file if it exists
     * @param internalName is the unique identifier for the file marked for deletion
     * @return a message indicating the success
     */
    public Mono<String> deleteFile(String internalName) {
        return SecurityUtil.getCurrentUser()
                .flatMap((user) -> {
                    Optional<Artifact> a = artifactRepository.findByUniqueIdentifier(internalName);
                    if (a.isPresent()) {
                        return deleteFile(a.get(), user);
                    }
                    return Mono.empty();
                });
    }

    /**
     * Deletes an artifact based on its id
     * @param id is the id of the artifact
     * @return a success message
     */
    public Mono<String> deleteFile(int id) {
        if (id == NO_FILE_ID) return Mono.just("Success");
        return SecurityUtil.getCurrentUser()
                .flatMap((user) -> {
                    Artifact a = artifactRepository.findById((long) id).get();
                    return deleteFile(a, user);
                });
    }

    /**
     * Deletes an artifact from the upload folder and the database
     * @param a is the artifact being deleted
     * @param user is the current user from the security context
     * @return the deleted file
     */
    public Mono<String> deleteFile(Artifact a, User user) {
        try {
            if (a.getUserId().equals(user.getId()) || user.isAdmin()) {
                Path fileToDelete = Paths.get(a.getFileLocation());
                Files.deleteIfExists(fileToDelete); // Delete file
                artifactRepository.delete(a); // Delete artifact entity
                return Mono.just("File deleted successfully");
            } else {
                return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "File does not belong to user"));
            }
        } catch (IOException e) {
            return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "File was not found"));
        }
    }

    /**
     * Validates the file uploaded is below the max size
     */
    private Mono<Boolean> validateFileSize(FilePart filePart) {
        return filePart
                .content()
                .reduce(0L, (currentSize, buffer) -> currentSize + buffer.readableByteCount())
                .flatMap(size -> {
                    if (size > MAX_FILE_SIZE_BYTES) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.PAYLOAD_TOO_LARGE,
                                "File size exceeds the maximum allowed size."
                        ));
                    } else {
                        return Mono.just(true);
                    }
                });
    }

    /**
     * Retreives a file based on its id
     * @param artifactID
     * @param headers
     * @return
     */
    public Mono<ResponseEntity<Resource>> getFile(String artifactID, HttpHeaders headers) {
        Artifact artifact = this.artifactRepository.findById(Long.valueOf(artifactID))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "artifact with id " + artifactID + " not found." ));

        Path normalizedDirectoryPath = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        Path normalizedFilePath = Paths.get(artifact.getFileLocation()).toAbsolutePath().normalize();

        if(!normalizedFilePath.startsWith(normalizedDirectoryPath)) {
            // should be impossible since we generate a hash for the file location but
            return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "File location is forbidden"));
        }

        return Mono.justOrEmpty(normalizedFilePath)
                .flatMap(p -> {
                    try {
                        // Create a FileSystemResource for the PDF file
                        Resource pdfResource = new FileSystemResource(p.toFile());

                        // Return ResponseEntity with headers and PDF resource
                        return Mono.just(ResponseEntity.ok()
                                .headers(headers)
                                .body(pdfResource));
                    } catch (Exception e) {
                        // Handle file not found or other errors
                        return Mono.just(ResponseEntity.notFound().build());
                    }
                });
    }

    /**
     * @return all artifacts
     */
    public Flux<Artifact> all() {
        return Flux.fromIterable(artifactRepository.findAll());
    }

    private static final int NO_FILE_ID = 1;
    private static final Artifact NO_FILE = Artifact.builder()
        .name("No File")
        .fileLocation("N/A")
        .build();

    /**
     * Clears out the files if the database is reset and adds
     * the default NO_FILE artifact
     */
    @PostConstruct
    private void initArtifacts() {
        try {
            long artifactCount = artifactRepository.count();
            if (artifactCount <= 1) {
                Path uploads = Paths.get(this.uploadDirectory);

                if (Files.exists(uploads)) {
                    Files.walk(uploads)
                        .map(Path::toFile)
                        .forEach(File::delete);
                } 
                Files.createDirectories(uploads);
                

                if (artifactCount == 0) artifactRepository.saveAndFlush(NO_FILE);   
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
