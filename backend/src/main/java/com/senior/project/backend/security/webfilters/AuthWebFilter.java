package com.senior.project.backend.security.webfilters;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;

import com.senior.project.backend.security.AuthService;
import reactor.core.publisher.Mono;

/**
 * Web filter for SPA applications
 * 
 * If the path does not start with API, forward to the angular frontend and use angular routing
 * instead of the spring routing
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
@Order(2)
public class AuthWebFilter extends AbstractAuthWebFilter {
    public AuthWebFilter(AuthService authService) {
        super(authService);
    }

    @Override
    protected Mono<Void> authFilter(
        ServerWebExchange exchange, 
        WebFilterChain chain,
        HttpHeaders resHeaders,
        HttpHeaders reqHeaders
    ) {
        String sessionId = reqHeaders.get(SESSION_HEADER).get(0);
        return authService.retrieveSession(sessionId)
            .flatMap(session -> {
                return chain.filter(exchange);
            });
    }
}

