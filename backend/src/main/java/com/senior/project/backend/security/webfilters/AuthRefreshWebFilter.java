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
        return authService.retrieveSession(sessionId)
            .flatMap(s -> {
                if (s.isInRefreshRange()) {
                    return authService.deleteSession(sessionId);
                }
                return Mono.just(s);
            })
            .flatMap(s -> {
                if (s.isValid()) return Mono.just(s);
                else return authService.createSession(s.getEmail());
            })
            .flatMap(s -> {
                exchange.getResponse()
                    .getHeaders()
                    .add(NEW_SESSION_HEADER, s.getId().toString());

                return chain.filter(
                    exchange.mutate()
                        .request(
                            exchange.getRequest()
                                .mutate()
                                .header(SESSION_HEADER, s.getId().toString())
                                .build()
                        )
                        .build()
                    );
                }
            );
    }  
}
