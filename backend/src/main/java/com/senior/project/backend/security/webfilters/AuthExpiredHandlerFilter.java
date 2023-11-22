package com.senior.project.backend.security.webfilters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.HandlerFilterFunction;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.AuthService;

import reactor.core.publisher.Mono;

public class AuthExpiredHandlerFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    @Autowired
    private AuthService authService;

    @Override
    public Mono<ServerResponse> filter(ServerRequest request, HandlerFunction<ServerResponse> next) {
        
        return next.handle(request);
    }
    
}
