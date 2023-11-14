package com.senior.project.backend.security.webfilters;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;

import com.senior.project.backend.security.AuthService;
import reactor.core.publisher.Mono;

@Component
@Order(3)
public class AuthRefreshWebFilter extends AbstractAuthWebFilter {

    public AuthRefreshWebFilter(AuthService authService) {
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
        authService.retrieveSession(sessionId).subscribe(s -> {
            if (s.isInRefreshRange()) {
                authService.deleteSession(sessionId)
                    .flatMap(os -> authService.createSession(os.getUser()))
                    .subscribe(ns -> {
                        resHeaders.add(NEW_SESSION_HEADER, ns.getSessionID().toString());
                    });
            }
        });
        return chain.filter(exchange);
    }  
}
