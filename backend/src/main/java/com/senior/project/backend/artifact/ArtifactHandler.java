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

import com.senior.project.backend.domain.Submission;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.submissions.SubmissionService;

import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.UUID;

/**
 * Handler for interacting with artifacts
 */
@Component
public class ArtifactHandler {

    private final ArtifactService artifactService;
    private final SubmissionService submissionService;
    private final CurrentUserUtil currentUserUtil;

    public ArtifactHandler(
        ArtifactService artifactService, 
        SubmissionService submissionService,
        CurrentUserUtil currentUserUtil
    ){
        this.artifactService = artifactService;
        this.submissionService = submissionService;
        this.currentUserUtil = currentUserUtil;
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
        return currentUserUtil.getCurrentUser().zipWith(Mono.just(Integer.parseInt(request.pathVariable("id"))))
            .flatMap((zip) -> {
                final User user = zip.getT1();
                int id = zip.getT2();
                if (id <= 1) return Mono.empty();
                return submissionService.findByArtifact(id)
                    .switchIfEmpty(Mono.just(Submission.builder().id(0).studentId(UUID.randomUUID()).build()))
                    .flatMap(submission -> submission.getId() == 0 ? Mono.just(submission) : submissionService.scrubArtifact(submission))
                    .doOnNext(submission -> {
                        if ( Objects.isNull(submission.getStudentId()) || (!user.getId().equals(submission.getStudentId()) && !user.hasAdminPrivileges())) {
                            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
                        } 
                    })
                    .flatMap(submission -> artifactService.deleteFile(id))
                    .flatMap(response -> ServerResponse.ok().contentType(MediaType.TEXT_PLAIN).bodyValue(response));
            })
            .switchIfEmpty(ServerResponse.accepted().build());
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
