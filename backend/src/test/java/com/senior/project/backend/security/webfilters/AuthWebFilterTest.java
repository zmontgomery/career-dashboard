package com.senior.project.backend.security.webfilters;

import java.util.NoSuchElementException;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
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
import com.senior.project.backend.security.AuthService;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class AuthWebFilterTest {

    @InjectMocks
    private AuthWebFilter CuT;

    @Mock
    private AuthService authService;

    private String token;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        token = "token";

        webTestClient = WebTestClient
            .bindToRouterFunction(
                RouterFunctions.route()
                    .OPTIONS(Endpoints.TEST_NEEDS_AUTH.uri(), Constants::handle)
                    .GET(Endpoints.TEST_NEEDS_AUTH.uri(), Constants::handle)
                    .GET(Endpoints.TEST_NO_AUTH.uri(), Constants::handle)
                    .build()
            )
            .webFilter(CuT)
            .build();
    }

    @Test
    public void preflight() {
        webTestClient.options()
            .uri(Endpoints.TEST_NEEDS_AUTH.uri())
            .exchange()
            .expectStatus()
            .isOk();
    }

    @Test
    public void happy() {
        webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.uri())
            .header(AbstractAuthWebFilter.AUTHORIZATION_HEADER, token)
            .exchange()
            .expectStatus()
            .isOk();
    }

    @Test
    public void unhappy() {
        webTestClient.get()
            .uri(Endpoints.TEST_NEEDS_AUTH.uri())
            .header(AbstractAuthWebFilter.AUTHORIZATION_HEADER, token)
            .exchange()
            .expectStatus()
            .isUnauthorized();
    }

    @Test
    public void unprotectedEndpoint() {
        webTestClient.get()
            .uri(Endpoints.TEST_NO_AUTH.uri())
            .exchange()
            .expectStatus()
            .isOk();
    }
}
