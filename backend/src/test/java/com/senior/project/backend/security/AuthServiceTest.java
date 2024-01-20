package com.senior.project.backend.security;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import org.jose4j.jwt.NumericDate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TempUser;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @InjectMocks
    private AuthService CuT;

    @Mock
    private TokenGenerator tokenGenerator;

    private static final TempUser USER = TempUser.builder()
        .email("test@test.test")
        .build();

    private static final String TOKEN = "token";
    private static final String TOKEN_2 = "token2";

    @Test
    public void testLogin() {
        when(tokenGenerator.generateToken(any())).thenReturn(TOKEN);
        LoginResponse expected = LoginResponse.builder()
            .user(USER)
            .token(TOKEN)
            .build();
        
        Mono<LoginResponse> actual = CuT.login(USER);

        StepVerifier.create(actual)
            .expectNext(expected)
            .expectComplete()
            .verify();
    }

    @Test
    public void testRefreshHappy() throws TokenVerificiationException {
        when(tokenGenerator.extractExpDate(anyString()))
            .thenReturn(NumericDate.fromMilliseconds(System.currentTimeMillis() + 600000));
        when(tokenGenerator.generateToken(any())).thenReturn(TOKEN_2);
        when(tokenGenerator.extractEmail(anyString())).thenReturn(USER.getEmail());
        LoginResponse expected = LoginResponse.builder()
            .user(USER)
            .token(TOKEN_2)
            .build();

        Mono<LoginResponse> actual = CuT.refreshToken(TOKEN);

        StepVerifier.create(actual)
            .expectNext(expected)
            .expectComplete()
            .verify();
    }

    @Test
    public void testRefreshBadToken() throws TokenVerificiationException {
        when(tokenGenerator.extractExpDate(anyString())).thenThrow(new TokenVerificiationException("whoops"));

        try {
            CuT.refreshToken(TOKEN);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            return;
        }
    }

    @Test
    public void testRefreshNotInRefreshRange() throws TokenVerificiationException {
        when(tokenGenerator.extractExpDate(anyString()))
            .thenReturn(NumericDate.fromMilliseconds(System.currentTimeMillis() + 10000000));
        
        try {
            CuT.refreshToken(TOKEN);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            return;
        }
    }

    @Test
    public void testRefreshNoUser() throws TokenVerificiationException {
        when(tokenGenerator.extractExpDate(anyString()))
            .thenReturn(NumericDate.fromMilliseconds(System.currentTimeMillis() + 600000));
        when(tokenGenerator.extractEmail(anyString())).thenThrow(new TokenVerificiationException("error"));

        try {
            CuT.refreshToken(TOKEN);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            return;
        }
    }
}
