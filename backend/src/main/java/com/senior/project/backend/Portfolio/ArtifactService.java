package com.senior.project.backend.Portfolio;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
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
        // TODO Validate file size, type.

        // Generate a unique identifier for the file
        String fileId = UUID.randomUUID().toString();

        // Construct the destination path using the unique identifier
        Path destination = Paths.get(uploadDirectory, fileId);

        // Save the file to the specified directory
        return filePart.transferTo(destination)
                .thenReturn("File uploaded successfully");
    }
}
