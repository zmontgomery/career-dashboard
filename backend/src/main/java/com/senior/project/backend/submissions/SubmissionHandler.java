package com.senior.project.backend.submissions;

import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.domain.Submission;
import com.senior.project.backend.security.SecurityUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Mono;
import java.util.stream.Collectors;
import java.util.List;

@Component
public class SubmissionHandler {

    private static final String TASK_ID = "taskId";

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
            .map((submission) -> { // Set artifact id to no file if no artifact is given
                if (submission.getArtifactId() == 0) submission.setArtifactId(1);
                return submission;
            })
            .flatMap((submission) -> submissionService.addSubmission(submission)) // Add submission
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to submit.")))
            .map((submission) -> { // Copy submission
                newSubmission.from(submission);
                return submission;
            })
            // Get previous submissions
            .flatMapMany((submission) -> submissionService.getPreviousSubmissions(submission.getStudentId(), submission.getTaskId()))
            .filter((submission) -> newSubmission.getArtifactId() != submission.getArtifactId())
            .flatMap((submission) -> { // Save artifact id and remove the previous artifact from the submission
                int artifactId = submission.getArtifactId();
                return submissionService.scrubArtifact(submission)
                    .map((s) -> artifactId);
            })
            .flatMap((artifactId) -> artifactService.deleteFile(artifactId)) // Delete the old artifacts
            .collectList()
            .flatMap((s) -> ServerResponse.ok().bodyValue(newSubmission));
    }

    public Mono<ServerResponse> getLatestSubmission(ServerRequest serverRequest) {
        return SecurityUtil.getCurrentUser()
            .flatMapMany((user) -> submissionService.getSubmissions(user.getId(), Integer.parseInt(serverRequest.pathVariable(TASK_ID))))
            .collectList()
            .map((submissions) -> {
                List<Submission> newList = submissions.stream()
                    .sorted((s1, s2) -> s1.getSubmissionDate().before(s2.getSubmissionDate()) ? -1 : 1)
                    .collect(Collectors.toList());
                return newList.get(newList.size() - 1);
            })
            .flatMap((submission) -> ServerResponse.ok().bodyValue(submission));
    }
}
