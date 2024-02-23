package com.senior.project.backend.submissions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Submission;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class SubmissionServiceTest {
    
    @InjectMocks
    private SubmissionService submissionService;

    @Mock
    private SubmissionRepository submissionRepository;

    @Test
    public void testAddSubmission() {
        when(submissionRepository.saveAndFlush(any())).thenReturn(Constants.submission1);

        Mono<Submission> result = submissionService.addSubmission(Constants.submission1);

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testAddSubmissionEmpty() {
        when(submissionRepository.saveAndFlush(any())).thenThrow(new NullPointerException());

        Mono<Submission> result = submissionService.addSubmission(Constants.submission1);

        StepVerifier.create(result)
            .expectComplete()
            .verify();
    }

    @Test
    public void testGetPreviousSubmission() {
        when(submissionRepository.findAllBeforeNowWithUserAndTask(any(), any(), anyInt())).thenReturn(Constants.SUBMISSIONS);

        Flux<Submission> result = submissionService.getPreviousSubmissions(Constants.user1.getId(), 1);

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectNext(Constants.submission2)
            .expectComplete()
            .verify();
    }

    @Test
    public void testGetSubmissions() {
        when(submissionRepository.findAllBeforeNowWithUserAndTask(any(), any(), anyInt())).thenReturn(Constants.SUBMISSIONS);

        Flux<Submission> result = submissionService.getSubmissions(Constants.user1.getId(), 1);

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectNext(Constants.submission2)
            .expectComplete()
            .verify();
    }

    @Test
    public void testScrubArtifact() {
        when(submissionRepository.saveAndFlush(any())).thenReturn(Constants.submission1);

        Mono<Submission> result = submissionService.scrubArtifact(Constants.submission1)
            .map((submission) -> {
                assertEquals(submission.getArtifactId(), 1);
                submission.setArtifactId(2); // reset id to original state
                return submission;
            });

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectComplete()
            .verify();
    }
}
