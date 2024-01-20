package com.senior.project.backend.security;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TokenType;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.security.verifiers.TokenVerifier;
import com.senior.project.backend.security.verifiers.TokenVerifierGetter;

import reactor.core.publisher.Mono;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthHandlerTest {

    private static final String TEST_SIGN_IN = "/testSignIn";
    private static final String TEST_REFRESH = "/testRefresh";
    private static final String TEST_FAIL = "/testFailure";
    private static final String TEST_SIGN_OUT = "/testSignOut";
    private static final String AUTHORIZATION_HEADER = "X-Authorization";

    private WebTestClient webTestClient;

    @InjectMocks
    private AuthHandler CuT;

    @Mock
    private TokenVerifierGetter tokenVerifierGetter;

    @Mock
    private AuthService authService;
    
    @Mock
    private TokenVerifier verifier;

    @BeforeEach
    public void setup() throws TokenVerificiationException {
        webTestClient = WebTestClient.bindToRouterFunction(
            RouterFunctions.route()
                .POST(TEST_SIGN_IN, CuT::signIn)
                .POST(TEST_REFRESH, CuT::refresh)
                .POST(TEST_SIGN_OUT, CuT::signOut)
                .GET(TEST_FAIL, CuT::authenticationFailed)
                .build()
        )
            .build();
    }

    @Test
    public void testSignInHappy() throws TokenVerificiationException {
        LoginRequest request = new LoginRequest("token", TokenType.GOOGLE);
        LoginResponse response = LoginResponse.builder().token("token_2").build();

        when(tokenVerifierGetter.getTokenVerifier(any())).thenReturn(verifier);
        when(authService.login(any())).thenReturn(Mono.just(response));
        when(verifier.verifiyIDToken(anyString())).thenReturn("answer");

        LoginResponse response2 = webTestClient
            .post()
            .uri(TEST_SIGN_IN)
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
        when(tokenVerifierGetter.getTokenVerifier(any())).thenReturn(verifier);
        LoginRequest request = new LoginRequest("token", TokenType.GOOGLE);

        when(verifier.verifiyIDToken(anyString())).thenThrow(new TokenVerificiationException("fail"));

        String result = webTestClient
            .post()
            .uri(TEST_SIGN_IN)
            .bodyValue(request)
            .exchange()
            .expectStatus().isEqualTo(403)
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals(result, "An error ocurred during sign in");
    }

    @Test
    public void testRefreshHappy() throws TokenVerificiationException {
        LoginResponse response = LoginResponse.builder().token("token_2").build();

        when(authService.refreshToken(anyString())).thenReturn(Mono.just(response));

        LoginResponse result = webTestClient
            .post()
            .uri(TEST_REFRESH)
            .header(AUTHORIZATION_HEADER, "Bearer token")
            .exchange()
            .expectStatus().isOk()
            .expectBody(LoginResponse.class)
            .returnResult()
            .getResponseBody();

        assertEquals(response, result);
    }

    @Test
    public void testRefreshBadToken() throws TokenVerificiationException {
        when(authService.refreshToken(anyString())).thenThrow(new TokenVerificiationException("Bad token"));

        String result = webTestClient
            .post()
            .uri(TEST_REFRESH)
            .header(AUTHORIZATION_HEADER, "Bearer token")
            .exchange()
            .expectStatus().isForbidden()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals("An error ocurred when refreshing the token", result);
    }

    @Test
    public void testRefreshNoHeader() throws TokenVerificiationException {
        String result = webTestClient
            .post()
            .uri(TEST_REFRESH)
            .exchange()
            .expectStatus().isForbidden()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals("An error ocurred when refreshing the token", result);
    }

    @Test
    public void testFailure() {
        String result = webTestClient
            .get()
            .uri(TEST_FAIL)
            .exchange()
            .expectStatus().isUnauthorized()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals("Unauthorized.", result);
    }

    @Test
    public void testSignOut() {
        String result = webTestClient
            .post()
            .uri(TEST_SIGN_OUT)
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        assertEquals("", result);
    }
}
