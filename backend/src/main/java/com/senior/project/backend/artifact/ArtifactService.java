package com.senior.project.backend.artifact;

import com.google.common.base.Supplier;
import com.senior.project.backend.Activity.EventRepository;
import com.senior.project.backend.domain.Artifact;
import com.senior.project.backend.domain.ArtifactType;
import com.senior.project.backend.domain.Event;
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
import java.util.*;

@Service
public class ArtifactService {

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    @Value("${FILE_UPLOAD_DIRECTORY:}")
    private String _uploadDirectory;

    private final String uploadDirectory;

    private final ArtifactRepository artifactRepository;
    private final EventRepository eventRepository;

    // Make sure to add any filetypes to the getFileExtension method
    private final List<MediaType> TASK_ARTIFACT_TYPES = List.of(MediaType.APPLICATION_PDF);
    private final List<MediaType> IMAGE_TYPES = List.of(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG);

    public ArtifactService(ArtifactRepository artifactRepository, EventRepository eventRepository) {
        this.artifactRepository = artifactRepository;
        this.eventRepository = eventRepository;
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
    public Mono<Integer> processSubmissionFile(FilePart filePart) {
        return validateAndGetPath(filePart, TASK_ARTIFACT_TYPES)
                .flatMap(destination -> {
                    Artifact upload = new Artifact();
                    upload.setFileLocation(destination.toString());
                    upload.setName(filePart.filename());
                    upload.setType(ArtifactType.SUBMISSION);

                    // Save the file to the specified directory
                    return filePart.transferTo(destination)
                            .then(SecurityUtil.getCurrentUser())
                            .map((user) -> {
                                upload.setUserId(user.getId());
                                return upload;
                            })
                            .flatMap((artifact) -> Mono.just(artifactRepository.save(artifact)))
                            .flatMap((artifact) -> findByUniqueFilename(artifact.getFileLocation()))
                            .map(Artifact::getId);
                });
    }

    public Mono<Integer> processEventImage(FilePart filePart, long eventID) {
        return validateAndGetPath(filePart, IMAGE_TYPES)
                .flatMap(destination -> {

                    Artifact upload = new Artifact();
                    upload.setFileLocation(destination.toString());
                    upload.setName(filePart.filename());
                    upload.setType(ArtifactType.EVENT_IMAGE);

                    // Save the file to the specified directory
                    return filePart.transferTo(destination)
                            .then(Mono.defer(() -> {
                                Optional<Event> event = eventRepository.findById(eventID);
                                if (event.isPresent() && event.get().getImageId() != null) {
                                    // TODO change event id to use long
                                    return deleteFile(Math.toIntExact(event.get().getImageId()));
                                }
                                return Mono.empty();
                            }))
                            .then(Mono.defer(() -> Mono.just(artifactRepository.save(upload))))
                            .flatMap((artifact) -> findByUniqueFilename(artifact.getFileLocation()))
                            .map(Artifact::getId)
                            .map((id) -> {
                                eventRepository.updateImageIdById((long)id, eventID);
                                return id;
                            });
                });
    }

    private Mono<Path> validateAndGetPath(FilePart filePart, List<MediaType> acceptableTypes) {
        return validateFileSize(filePart)
                .flatMap((filePart1 -> {
                    // Check if the file is a PDF based on content type
                    MediaType contentType = filePart.headers().getContentType();
                    if (contentType == null) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "No Content type provided for file"));
                    }
                    Optional<String> extension = getFileExtension(contentType);
                    if (!acceptableTypes.contains(contentType) || extension.isEmpty()) {
                        return Mono.error(new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported filetype"));
                    }

                    // Generate a unique identifier for the file
                    String uniqueFilename = UUID.randomUUID() + extension.get();

                    // Construct the destination path using the unique identifier
                    return Mono.just(Paths.get(uploadDirectory, uniqueFilename));
                }));
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
                    Optional<Artifact> a = artifactRepository.findById((long) id);
                    if (a.isPresent()) {
                        return deleteFile(a.get(), user);
                    }
                    return Mono.empty();
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
            System.out.println(a);
            System.out.println(user);
            if (user.hasAdminPrivileges() || a.getUserId().equals(user.getId())) {
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
    private Mono<FilePart> validateFileSize(FilePart filePart) {
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
                        return Mono.just(filePart);
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

        return Mono.defer(() -> {
                    if (artifact.getType() == ArtifactType.EVENT_IMAGE) {
                        return Mono.empty();
                    }
                    return SecurityUtil.getCurrentUser()
                            .flatMap(user -> {
                                System.out.println(user.getId());
                                System.out.println(artifact.getUserId());
                                if (!user.hasFacultyPrivileges() && !user.getId().equals(artifact.getUserId())){
                                    return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN,
                                            "User does not have access to this artifact"));
                                }
                                return Mono.empty();
                            });
                })
                .then(Mono.defer(() -> {
                    Path normalizedDirectoryPath = Paths.get(uploadDirectory).toAbsolutePath().normalize();
                    Path normalizedFilePath = Paths.get(artifact.getFileLocation()).toAbsolutePath().normalize();

                    if(!normalizedFilePath.startsWith(normalizedDirectoryPath)) {
                        // should be impossible since we generate a hash for the file location but
                        return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "File location is forbidden"));
                    }
                    var p = normalizedFilePath;
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
                }));
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

    public static Optional<String> getFileExtension(MediaType mediaType) {
        // image types
        if (mediaType.equals(MediaType.IMAGE_JPEG)) {
            return ".jpg".describeConstable();
        } else if (mediaType.equals(MediaType.IMAGE_PNG)) {
            return ".png".describeConstable();
        }

        // PDF
        if (mediaType.equals(MediaType.APPLICATION_PDF)) {
            return ".pdf".describeConstable();
        }

        // not currently supported because resume viewer won't work
        // Word documents
        if (mediaType.equals(MediaType.valueOf("application/msword"))) {
            return ".docx".describeConstable();
        }

        // Add more mappings as needed

        // If no mapping found, return a empty
        return Optional.empty();
    }
}
