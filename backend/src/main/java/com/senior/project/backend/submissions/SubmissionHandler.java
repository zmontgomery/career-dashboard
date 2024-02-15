package com.senior.project.backend.submissions;

import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.domain.Submission;

import org.slf4j.LoggerFactory;
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

    public Mono<ServerResponse> handleSubmission(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(Submission.class)
            .flatMap((submission) -> submissionService.addSubmission(submission))
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to submit.")))
            .flatMapMany((submission) -> submissionService.getPreviousSubmissions(submission.getStudentId(), submission.getTaskId()))
            .collectList()
            .map((submissions) -> {
                submissions.stream().forEach((a) -> {
                    LoggerFactory.getLogger(getClass()).info("CHECKPOINT");
                    artifactService.deleteFile(a.getId());
                });
                return submissions;
            })
            .then(serverRequest.bodyToMono(Submission.class))
            .flatMap((sub) -> ServerResponse.ok().bodyValue(sub));
    }
}
