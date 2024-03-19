package com.senior.project.backend.submissions;

import com.senior.project.backend.domain.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.senior.project.backend.security.SecurityUtil;


import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.Date;
import java.util.Optional;

/**
 * Service to interact with the repository layer for submissions
 */
@Service
public class SubmissionService {
    private static final int BUFFER_TIME = 500; // Half a second

    @Autowired
    private SubmissionRepository submissionRepository;

    /**
     * Adds a submission to the repository
     * @param submission
     * @return
     */
    public Mono<Submission> addSubmission(Submission submission) {
        try {
            return Mono.just(submissionRepository.saveAndFlush(submission));
        } catch (Exception e) {
            return Mono.empty();
        }
    }

    /**
     * Returns all submissions for a given task
     * @param userId
     * @param taskId
     * @return
     */
    public Flux<Submission> getSubmissions(UUID userId, int taskId) {
        return Flux.fromIterable(submissionRepository.findAllWithUserAndTask(userId, taskId));
    }


    /**
     * Returns all submissions for the current user
     * @param userId
     * @return the submissions or unauthorized error if the request is for a different user
     */
    public Flux<Submission> getStudentSubmissions(UUID userId) {
        return SecurityUtil.getCurrentUser().flatMapMany(user -> {
            if (user.getId().equals(userId)) {
                return Flux.fromIterable(submissionRepository.findAllWithUser(userId));
            }
            else {
                return Flux.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Can't get submissions for other users"));
            }
        });
    }

    /**
     * Sets the artifact id to No File
     * @param submission
     * @return
     */
    public Mono<Submission> scrubArtifact(Submission submission) {
        submission.setArtifactId(1);
        return addSubmission(submission);
    }

    /**
     * @param artifactId
     * @return the submission with the given artifact id
     */
    public Mono<Submission> findByArtifact(int artifactId) {
        Optional<Submission> submission = submissionRepository.findSubmissionByArtifactId(artifactId);
        if (submission.isPresent()) {
            return Mono.just(submission.get());
        }
        return Mono.empty();
    }
}
