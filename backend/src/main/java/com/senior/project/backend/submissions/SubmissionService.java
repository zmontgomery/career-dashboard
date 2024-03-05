package com.senior.project.backend.submissions;

import com.senior.project.backend.domain.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.Date;

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
     * Returns all submissions before the provided date for a given task and user
     * @param userId
     * @param taskId
     * @return
     */
    public Flux<Submission> getPreviousSubmissions(UUID userId, int taskId) {
        Date date = new Date(System.currentTimeMillis() - BUFFER_TIME);
        return Flux.fromIterable(submissionRepository.findAllBeforeNowWithUserAndTask(date, userId, taskId));
    }

    /**
     * Returns all submissions for a given task
     * @param userId
     * @param taskId
     * @return
     */
    public Flux<Submission> getSubmissions(UUID userId, int taskId) {
        Date date = new Date(System.currentTimeMillis() + BUFFER_TIME);
        return Flux.fromIterable(submissionRepository.findAllBeforeNowWithUserAndTask(date, userId, taskId));
    }


    /**
     * Returns all submissions for a given user
     * @param userId
     * @return
     */
    public Flux<Submission> getStudentSubmissions(UUID userId) {
        Date date = new Date(System.currentTimeMillis() + BUFFER_TIME);
        return Flux.fromIterable(submissionRepository.findAllBeforeNowWithUser(date, userId));
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
}
