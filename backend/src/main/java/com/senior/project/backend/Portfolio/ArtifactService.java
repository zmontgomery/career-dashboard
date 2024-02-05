package com.senior.project.backend.Portfolio;

import com.senior.project.backend.domain.Artifact;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

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

    public Mono<String> processFile(FilePart filePart) {
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

                // TODO add comment capture
                upload.setComment("");

                // Save the file to the specified directory
                return filePart.transferTo(destination)
                        // TODO need to also add to user's portfolio table in DB?
                        .then(Mono.fromRunnable(() -> artifactRepository.save(upload)))
                        .thenReturn("File uploaded successfully");
            }
        );
    }

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

    public Flux<Artifact> all() {
        return Flux.fromIterable(artifactRepository.findAll());
    }
}
