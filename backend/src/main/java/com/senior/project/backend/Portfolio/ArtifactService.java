package com.senior.project.backend.Portfolio;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ArtifactService {

    @Value("${FILE_UPLOAD_DIRECTORY}")
    private String uploadDirectory;

    private final ArtifactRepository artifactRepository;

    public ArtifactService(ArtifactRepository artifactRepository) { this.artifactRepository = artifactRepository;}

    public Mono<String> processFile(FilePart filePart) {
        // TODO Validate file size.
        String extension;

        // Check if the file is a PDF based on content type
        MediaType contentType = filePart.headers().getContentType();
        if (contentType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No Content type provided for file");
        } else if (contentType.isCompatibleWith(MediaType.APPLICATION_PDF)){
            extension = ".pdf";
        }
        // Add more file types here
        else {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported filetype");
        }

        // Generate a unique identifier for the file
        String uniqueFilename = UUID.randomUUID() + extension;

        // Construct the destination path using the unique identifier
        Path destination = Paths.get(uploadDirectory, uniqueFilename);

        // Save the file to the specified directory
        return filePart.transferTo(destination)
                .thenReturn("File uploaded successfully");
    }
}
