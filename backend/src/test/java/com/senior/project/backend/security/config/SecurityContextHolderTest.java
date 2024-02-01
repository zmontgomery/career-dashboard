package com.senior.project.backend.security.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;

import com.senior.project.backend.Constants;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class SecurityContextHolderTest {
    @InjectMocks
    private AuthenticationConfig authenticationConfig;

    @Mock
    private ReactiveAuthenticationManager authenticationManager;

    @Mock
    private ServerWebExchange serverWebExchange;

    @Mock
    private SecurityContext securityContext;

    private ServerSecurityContextRepository CuT;

    @BeforeEach
    public void setup() {
        CuT = authenticationConfig.securityContextRepository(authenticationManager);
    }

    @Test
    public void save() {
        Mono<Void> save = CuT.save(serverWebExchange, securityContext);

        StepVerifier.create(save)
            .expectComplete()
            .verify();
    }

    @Test
    public void testLoadHappy() {
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(Constants.user1, "", Constants.user1.getAuthorities());
        SecurityContext expected = new SecurityContextImpl(authToken);

        ServerHttpRequest request = mock(ServerHttpRequest.class);
        HttpHeaders headers = mock(HttpHeaders.class);
        when(serverWebExchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(anyString())).thenReturn("Bearer token");
        when(authenticationManager.authenticate(any())).thenReturn(Mono.just(authToken));

        Mono<SecurityContext> context = CuT.load(serverWebExchange);

        StepVerifier.create(context)
            .expectNext(expected)
            .expectComplete()
            .verify();
    }

    @Test
    public void testLoadNoHeader() {
        ServerHttpRequest request = mock(ServerHttpRequest.class);
        HttpHeaders headers = mock(HttpHeaders.class);
        when(serverWebExchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(anyString())).thenReturn(null);

        Mono<SecurityContext> context = CuT.load(serverWebExchange);

        StepVerifier.create(context)
            .expectError(ResponseStatusException.class)
            .verify();
    }

    @Test
    public void testLoadMalformedHeader() {
        ServerHttpRequest request = mock(ServerHttpRequest.class);
        HttpHeaders headers = mock(HttpHeaders.class);
        when(serverWebExchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(anyString())).thenReturn("token");
        
        Mono<SecurityContext> context = CuT.load(serverWebExchange);

        StepVerifier.create(context)
            .expectError(ResponseStatusException.class)
            .verify();
    }
}
