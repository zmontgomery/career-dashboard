package com.senior.project.backend.security.webfilters;

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
public class AuthRefreshWebFilterTest {

    @InjectMocks
    private AuthRefreshWebFilter CuT;

    @Mock
    private AuthService authService;

    private Session session;
    private Session newSession;
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

        newSession = Session.builder()
            .id(UUID.randomUUID())
            .build();

        webTestClient = WebTestClient
            .bindToRouterFunction(
                RouterFunctions.route()
                    .OPTIONS(Endpoints.TEST_NEEDS_AUTH.getValue(), Constants::handle)
                    .GET(Endpoints.TEST_NEEDS_AUTH.getValue(), Constants::handle)
                    .GET(Endpoints.TEST_NO_AUTH.getValue(), Constants::handle)
                    .build()
            )
            .webFilter(CuT)
            .build();
    }

    @Test
    public void preflight() {
        webTestClient.options()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .exchange()
            .expectStatus()
            .isOk();
    }

    @Test
    public void happy_noNeedForRefresh() {
        session.setValid(true);
        when(session.isInRefreshRange()).thenReturn(false);
        when(authService.retrieveSession(anyString())).thenReturn(Mono.just(session));

        webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .header(AbstractAuthWebFilter.SESSION_HEADER, session.getId().toString())
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .doesNotExist(AbstractAuthWebFilter.NEW_SESSION_HEADER);
    }

    @Test
    public void happy_needsRefresh() {
        session.setValid(false);
        when(session.isInRefreshRange()).thenReturn(true);
        when(authService.deleteSession(anyString())).thenReturn(Mono.just(session));
        when(authService.retrieveSession(anyString())).thenReturn(Mono.just(session));
        when(authService.createSession(anyString())).thenReturn(Mono.just(newSession));

        webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .header(AbstractAuthWebFilter.SESSION_HEADER, session.getId().toString())
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .valueEquals(AbstractAuthWebFilter.NEW_SESSION_HEADER, newSession.getId().toString());
    }

    @Test
    public void unhappy() {
        when(authService.retrieveSession(anyString())).thenThrow(new NoSuchElementException());
        
        webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.getValue())
            .header(AbstractAuthWebFilter.SESSION_HEADER, session.getId().toString())
            .exchange()
            .expectStatus()
            .isUnauthorized();
    }
}

