package com.senior.project.backend.security.webfilters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFilterFunction;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.AuthService;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

/**
 * Filter for expiring a session if it is no longer valid
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class AuthExpiredHandlerFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private AuthService authService;

    /**
     * Filters the request
     */
    @Override
    public Mono<ServerResponse> filter(ServerRequest request, HandlerFunction<ServerResponse> next) {
        Endpoints endpoint = Endpoints.toEndpoint(request.path());
        
        if (endpoint.getNeedsAuthentication()) {
            return checkForExpiry(request, next);
        } else {
            return next.handle(request);
        }
    }

    /**
     * Attempts to retrieve the session and then checks for the expiry status fo the
     * session
     * 
     * @return the server response
     */
    private Mono<ServerResponse> checkForExpiry(ServerRequest request, HandlerFunction<ServerResponse> next) {
        try {
            String sessionId = request
                .headers()
                .asHttpHeaders()
                .get(AbstractAuthWebFilter.SESSION_HEADER)
                .get(0);

            return authService.retrieveSession(sessionId)
                .flatMap(session -> {
                    if (session.isExpired()) {
                        authService.deleteSession(sessionId).subscribe();
                            
                        return ServerResponse.status(403).bodyValue("Session expired.");
                    }

                    return next.handle(request);
                });
        } catch (Exception e) {
            return ServerResponse.status(401).bodyValue("Unauthorized.");
        }
    }
    
}
