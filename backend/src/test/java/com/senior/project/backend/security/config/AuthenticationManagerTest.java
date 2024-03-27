package com.senior.project.backend.security.config;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.web.server.ResponseStatusException;

import com.senior.project.backend.Constants;
import com.senior.project.backend.security.TokenGenerator;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class AuthenticationManagerTest {
    @InjectMocks
    private AuthenticationConfig authenticationConfig;
    
    @Mock
    private ReactiveUserDetailsService userDetailsService;

    @Mock
    private TokenGenerator tokenGenerator;

    private ReactiveAuthenticationManager CuT;

    private UsernamePasswordAuthenticationToken token = 
        new UsernamePasswordAuthenticationToken("email", "");

    private UsernamePasswordAuthenticationToken expectedToken =
        new UsernamePasswordAuthenticationToken(Constants.userAdmin, "", Constants.userAdmin.getAuthorities());

    @BeforeEach
    public void setup() {
        CuT = authenticationConfig.authenticationManager(userDetailsService, tokenGenerator);
    }

    @Test
    public void testHappyPath() throws TokenVerificiationException {
        when(tokenGenerator.extractEmail(anyString())).thenReturn(Constants.userAdmin.getEmail());
        when(userDetailsService.findByUsername(anyString())).thenReturn(Mono.just(Constants.userAdmin));

        Mono<Authentication> auth = CuT.authenticate(token);

        StepVerifier.create(auth)
            .expectNext(expectedToken)
            .expectComplete()
            .verify();
    }

    @Test
    public void testEmailCannotExtract() throws TokenVerificiationException {
        when(tokenGenerator.extractEmail(anyString())).thenThrow(new TokenVerificiationException(""));

        Mono<Authentication> auth = CuT.authenticate(token);

        StepVerifier.create(auth)
            .expectError(ResponseStatusException.class)
            .verify();
    }

    @Test
    public void testUserNotFound() throws TokenVerificiationException {
        when(tokenGenerator.extractEmail(anyString())).thenReturn(Constants.userAdmin.getEmail());
        when(userDetailsService.findByUsername(anyString())).thenReturn(Mono.empty());

        Mono<Authentication> auth = CuT.authenticate(token);

        StepVerifier.create(auth)
            .expectError(ResponseStatusException.class)
            .verify();
    }
}
