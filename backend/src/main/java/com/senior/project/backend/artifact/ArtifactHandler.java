package com.senior.project.backend.artifact;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Objects;

/**
 * Handler for interacting with artifacts
 */
@Component
public class ArtifactHandler {

    private final ArtifactService artifactService;

    public ArtifactHandler(ArtifactService artifactService){
        this.artifactService = artifactService;
    }

    /**
     * Takes the file from the request body and stores it on the server
     */
    public Mono<ServerResponse> handleSubmissionUpload(ServerRequest request) {
        return getFilePart(request)
                .flatMap(artifactService::processSubmissionFile)
                .flatMap(response -> ServerResponse.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(response)
                );
    }

    public Mono<ServerResponse> handleEventImageUpload(ServerRequest request) {
        long eventID;
        try {
            eventID = Long.parseLong(request.pathVariable("eventID"));
        } catch (NumberFormatException e) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected eventID to be valid integer"));
        }

        return getFilePart(request)
                .flatMap((filePart) -> artifactService.processEventImage(filePart, eventID))
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response));
    }

    public Mono<ServerResponse> handleProfileImageUpload(ServerRequest request) {
        return Mono.error(new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED));
    }

    private static Mono<FilePart> getFilePart(ServerRequest request) {
        return request.multipartData()
                .map(parts -> parts.toSingleValueMap().get("file"))
                .filter(part -> part instanceof FilePart)
                .map(part -> (FilePart) part);
    }

    /**
     * Deletes the file with the given file name
     */
    public Mono<ServerResponse> handleFileDelete(ServerRequest request) {
        return artifactService.deleteFile(Integer.parseInt(request.pathVariable("id")))
            .flatMap((response) -> ServerResponse.ok().contentType(MediaType.TEXT_PLAIN).bodyValue(response));
    }

    /**
     * Returns the file based on the given artifact id
     */
    public Mono<ServerResponse> serveFile(ServerRequest request) {
        String artifactID = request.pathVariable("artifactID");

        // Set the appropriate headers
        HttpHeaders headers = new HttpHeaders();

        Mono<ResponseEntity<Resource>> file = artifactService.getFile(artifactID, headers);

        return file.flatMap(responseEntity ->
                ServerResponse.ok()
                        .body(BodyInserters.fromValue(Objects.requireNonNull(responseEntity.getBody()))));
    }
}
