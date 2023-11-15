package com.senior.project.backend.security;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TempUser;
import com.senior.project.backend.security.domain.TokenType;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.security.verifiers.TokenVerifier;
import com.senior.project.backend.security.verifiers.TokenVerifierGetter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthHandlerTest {
    private WebTestClient webTestClient;

    @InjectMocks
    private AuthHandler CuT;

    @Mock
    private TokenVerifierGetter tokenVerifierGetter;

    @Mock
    private AuthRepository authRepository;
    @Mock
    private TokenVerifier verifier;

    @BeforeEach
    public void setup() throws TokenVerificiationException {
        when(tokenVerifierGetter.getTokenVerifier(any())).thenReturn(verifier);

        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .POST("/test", CuT::signIn)
                        .build())
                .build();
    }

    @Test
    public void testSignInHappy() throws TokenVerificiationException {
        LoginRequest request = new LoginRequest("token", TokenType.GOOGLE);
        LoginResponse response = new LoginResponse("token", new TempUser());

        when(authRepository.addToken(anyString(), anyString())).thenReturn(Mono.just(response));
        when(verifier.verifiyIDToken(anyString())).thenReturn("answer");

        LoginResponse response2 = webTestClient
            .post()
            .uri("/test")
            .bodyValue(request)
            .exchange()
            .expectStatus().isOk()
            .expectBody(LoginResponse.class)
            .returnResult()
            .getResponseBody();

        assertEquals(response, response2);
    }

    @Test
    public void testSignInUnhappy() throws TokenVerificiationException {
        LoginRequest request = new LoginRequest("token", TokenType.GOOGLE);
        LoginResponse response = new LoginResponse("token", new TempUser());

        when(verifier.verifiyIDToken(anyString())).thenThrow(new TokenVerificiationException("fail"));

        String result = webTestClient
            .post()
            .uri("/test")
            .bodyValue(request)
            .exchange()
            .expectStatus().isEqualTo(403)
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals(result, "An error ocurred during sign in");
    }
}
