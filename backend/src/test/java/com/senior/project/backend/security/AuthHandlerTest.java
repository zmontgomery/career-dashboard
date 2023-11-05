package com.senior.project.backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TempUser;
import com.senior.project.backend.security.domain.TokenType;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.security.verifiers.TokenVerifier;
import com.senior.project.backend.security.verifiers.TokenVerifierGetter;

import reactor.core.publisher.Mono;

@AutoConfigureWebTestClient
@SpringBootTest
public class AuthHandlerTest {
    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private AuthHandler CuT;

    private TokenVerifierGetter tokenVerifierGetter;
    private AuthRepository authRepository;
    private TokenVerifier verifier;

    @BeforeEach
    public void setup() throws TokenVerificiationException {
        this.authRepository = mock(AuthRepository.class);
        this.tokenVerifierGetter = mock(TokenVerifierGetter.class);
        this.verifier = mock(TokenVerifier.class);

        ReflectionTestUtils.setField(CuT, "repository", authRepository);
        ReflectionTestUtils.setField(CuT, "tokenVerifierGetter", tokenVerifierGetter);

        when(tokenVerifierGetter.getTokenVerifier(any())).thenReturn(verifier);
    }

    @Test
    public void testSignInHappy() throws TokenVerificiationException {
        LoginRequest request = new LoginRequest("token", TokenType.GOOGLE);
        LoginResponse response = new LoginResponse("token", new TempUser());

        when(authRepository.addToken(anyString(), anyString())).thenReturn(Mono.just(response));
        when(verifier.verifiyIDToken(anyString())).thenReturn("answer");

        LoginResponse response2 = webTestClient
            .post()
            .uri("/api/auth/signIn")
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

        when(authRepository.addToken(anyString(), anyString())).thenReturn(Mono.just(response));
        when(verifier.verifiyIDToken(anyString())).thenThrow(new TokenVerificiationException("fail"));

        String result = webTestClient
            .post()
            .uri("/api/auth/signIn")
            .bodyValue(request)
            .exchange()
            .expectStatus().isEqualTo(403)
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals(result, "An error ocurred during sign in");
    }
}
