package com.senior.project.backend.submissions;

import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.domain.Submission;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Mono;

@Component
public class SubmissionHandler {

    @Autowired
    SubmissionService submissionService;

    @Autowired
    ArtifactService artifactService;

    /**
     * Handles processing of a submission
     * 
     * Each task for each student can only have one submission, therefore
     * future submissions have to overriden. This reactor chain adds the new 
     * submission and collects all the previous submissions. It would then
     * set the artifact id to the "NO_FILE" artifact and delete the prior
     * artifact
     * 
     * @return 200 if operation is successful.
     */
    public Mono<ServerResponse> handleSubmission(ServerRequest serverRequest) {
        final Submission newSubmission = new Submission();
        return serverRequest.bodyToMono(Submission.class)
            .flatMap((submission) -> submissionService.addSubmission(submission))
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to submit.")))
            .map((submission) -> {
                newSubmission.from(submission);
                return submission;
            })
            .flatMapMany((submission) -> submissionService.getPreviousSubmissions(submission.getStudentId(), submission.getTaskId()))
            .flatMap((submission) -> {
                int artifactId = submission.getArtifactId();
                return submissionService.scrubArtifact(submission)
                    .map((s) -> artifactId);
            })
            .flatMap((artifactId) -> artifactService.deleteFile(artifactId))
            .collectList()
            .flatMap((s) -> ServerResponse.ok().bodyValue(newSubmission));
    }
}
