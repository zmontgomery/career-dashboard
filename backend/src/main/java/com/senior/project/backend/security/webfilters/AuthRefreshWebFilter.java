package com.senior.project.backend.security.webfilters;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;

import com.senior.project.backend.security.AuthService;
import reactor.core.publisher.Mono;

/**
 * Filter to refresh a session if it is within the refresh 
 * range, and then refreshes the session if it is
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
@Order(3)
public class AuthRefreshWebFilter extends AbstractAuthWebFilter {

    /**
     * Constructor
     * 
     * @param authService - the auth service
     */
    public AuthRefreshWebFilter(AuthService authService) {
        super(authService);
    }

    /**
     * Code that runs the authentication filter
     * 
     * Will retrieve the session, and if it needs to be refreshed
     * it will delete the old session, create a new one, and then
     * updates the request header with the new session id
     * 
     * @param exchange - The web exchange
     * @param chain - The filter chain
     * @return
     */
    @Override
    protected Mono<Void> authFilter(
        ServerWebExchange exchange, 
        WebFilterChain chain
    ) {
        String sessionId = exchange.getRequest()
            .getHeaders()
            .get(SESSION_HEADER)
            .get(0);

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
