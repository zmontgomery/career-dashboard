package com.senior.project.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Component
public class AuthRouter {
    @Bean
    public RouterFunction<ServerResponse> authRotues(AuthHandler handler) {
        return route(POST("/api/auth"), handler::signIn);
    }
}
