package com.senior.project.backend.submissions;

import com.senior.project.backend.domain.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.Date;

@Service
public class SubmissionService {
    private static final int BUFFER_TIME = 500; // Half a second

    @Autowired
    private SubmissionRepository submissionRepository;

    public Mono<Submission> addSubmission(Submission submission) {
        try {
            return Mono.just(submissionRepository.saveAndFlush(submission));
        } catch (Exception e) {
            return Mono.empty();
        }
    }

    public Flux<Submission> getPreviousSubmissions(UUID userId, int taskId) {
        Date date = new Date(System.currentTimeMillis() - BUFFER_TIME);
        return Flux.fromIterable(submissionRepository.findAllBeforeNowWithUserAndTask(date, userId, taskId));
    }
}
