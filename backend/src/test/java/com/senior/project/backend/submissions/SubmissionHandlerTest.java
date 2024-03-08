package com.senior.project.backend.submissions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;

import com.senior.project.backend.Constants;
import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.domain.Submission;
import com.senior.project.backend.security.AuthService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class SubmissionHandlerTest {

    @InjectMocks
    private SubmissionHandler submissionHandler;

    @Mock
    private SubmissionService submissionService;

    @Mock
    private ArtifactService artifactService;

    @Mock
    private AuthService authService;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .POST("/test", submissionHandler::handleSubmission)
                        .GET("/test/{taskId}", submissionHandler::getLatestSubmission)
                        .GET("/student", submissionHandler::getStudentSubmissions)
                        .build())
                .build();
    }

    @Test
    public void testHandleSubmission() {
        when(submissionService.addSubmission(Constants.submission1)).thenReturn(Mono.just(Constants.submission1));
        when(submissionService.getPreviousSubmissions(any(), anyInt())).thenReturn(Flux.fromIterable(Constants.SUBMISSIONS));
        when(submissionService.scrubArtifact(any())).thenReturn(Mono.just(Constants.submission1));
        when(artifactService.deleteFile(anyInt())).thenReturn(Mono.just("Success"));

        Submission result = webTestClient.post()
            .uri("/test")
            .bodyValue(Constants.submission1)
            .exchange()
            .expectStatus().isOk()
            .expectBody(Submission.class)
            .returnResult()
            .getResponseBody();

        assertEquals(result, Constants.submission1);    
        verify(submissionService, times(1)).addSubmission(Constants.submission1);
        verify(submissionService, times(1)).getPreviousSubmissions(any(), anyInt());
        verify(submissionService, times(1)).scrubArtifact(any());
        verify(artifactService, times(1)).deleteFile(anyInt());
    }

    @Test
    public void testHandleSubmissionNoPrevious() {
        when(submissionService.addSubmission(Constants.submission1)).thenReturn(Mono.just(Constants.submission1));
        when(submissionService.getPreviousSubmissions(any(), anyInt())).thenReturn(Flux.empty());

        Submission result = webTestClient.post()
            .uri("/test")
            .bodyValue(Constants.submission1)
            .exchange()
            .expectStatus().isOk()
            .expectBody(Submission.class)
            .returnResult()
            .getResponseBody();

        assertEquals(result, Constants.submission1);    
        verify(submissionService, times(1)).addSubmission(Constants.submission1);
        verify(submissionService, times(1)).getPreviousSubmissions(any(), anyInt());
        verify(submissionService, times(0)).scrubArtifact(any());
        verify(artifactService, times(0)).deleteFile(anyInt());
    }

    @Test
    public void testHandleSubmissionError() {
        when(submissionService.addSubmission(Constants.submission1)).thenReturn(Mono.empty());

        webTestClient.post()
            .uri("/test")
            .bodyValue(Constants.submission1)
            .exchange()
            .expectStatus().is5xxServerError();
    }

    @Test
    public void testGetLatestSubmission() {        
        when(submissionService.getSubmissions(any(), eq(1))).thenReturn(Flux.fromIterable(Constants.SUBMISSIONS));
        when(authService.currentUser()).thenReturn(Mono.just(Constants.user1));

        Submission result = webTestClient.get()
            .uri("/test/1")
            .exchange()
            .expectStatus().isOk()
            .expectBody(Submission.class)
            .returnResult()
            .getResponseBody();
        
        assertEquals(result, Constants.submission2);
    }

    @Test
    public void testLatestSubmissionWith404() {
        when(submissionService.getSubmissions(any(), eq(1))).thenReturn(Flux.fromIterable(new ArrayList<Submission>()));
        when(authService.currentUser()).thenReturn(Mono.just(Constants.user1));

        webTestClient.get()
            .uri("/test/1")
            .exchange()
            .expectStatus()
            .isNoContent();
    }

    @Test
    public void testGetStudentSubmissions() {  
        when(authService.currentUser()).thenReturn(Mono.just(Constants.user1));
        when(submissionService.getStudentSubmissions(Constants.user1.getId())).thenReturn(Flux.fromIterable(Constants.SUBMISSIONS));

        List<Submission> result = webTestClient.get()
            .uri("/student")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(Submission.class)
            .returnResult()
            .getResponseBody();
            
        assertEquals(result, Constants.SUBMISSIONS);
    }
}
