package com.senior.project.backend.security.webfilters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;

import com.senior.project.backend.Constants;
import com.senior.project.backend.security.AuthService;
import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class AuthExpiredHandlerFilterTest {

    @InjectMocks
    private AuthExpiredHandlerFilter CuT;

    @Mock
    private AuthService authService;

    private Session session;
    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        session = spy(
            Session.builder()
                .id(UUID.randomUUID())
                .email("test@test.test")
                .expiryDate(Date.from(Instant.now().plusMillis(50000)))
                .build()
        );

        webTestClient = WebTestClient
            .bindToRouterFunction(
                RouterFunctions.route()
                    .GET(Endpoints.TEST_NEEDS_AUTH.getValue(), Constants::handle)
                    .GET(Endpoints.TEST_NO_AUTH.getValue(), Constants::handle)
                    .build()
                    .filter(CuT)
            )
            .build();
    }

    @Test
    public void happy_unprotected() {
        webTestClient.get()
            .uri(Endpoints.TEST_NO_AUTH.getValue())
            .exchange()
            .expectStatus()
            .isOk();
    }

    @Test
    public void happy_checkExpiry() {
        when(session.isExpired()).thenReturn(false);
        when(authService.retrieveSession(anyString())).thenReturn(Mono.just(session));

        webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .header(AbstractAuthWebFilter.SESSION_HEADER, session.getId().toString())
            .exchange()
            .expectStatus()
            .isOk();
    }

    @Test
    public void unhappy_noSession() {
        when(authService.retrieveSession(anyString())).thenThrow(new NoSuchElementException());

        String res = webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .header(AbstractAuthWebFilter.SESSION_HEADER, session.getId().toString())
            .exchange()
            .expectStatus()
            .isUnauthorized()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();
            
        assertEquals(res, "Unauthorized.");
    }

     @Test
    public void unhappy_expired() {
        when(session.isExpired()).thenReturn(true);
        when(authService.retrieveSession(anyString())).thenReturn(Mono.just(session));
        when(authService.deleteSession(anyString())).thenReturn(Mono.just(session));

        String res = webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .header(AbstractAuthWebFilter.SESSION_HEADER, session.getId().toString())
            .exchange()
            .expectStatus()
            .isForbidden()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();
            
        assertEquals(res, "Session expired.");
    }
}
