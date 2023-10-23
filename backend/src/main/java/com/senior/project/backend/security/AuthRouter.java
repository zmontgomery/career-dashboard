package com.senior.project.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.URIBuilder;

import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Component
public class AuthRouter {

    private URIBuilder builder;

    public AuthRouter(URIBuilder builder) {
        this.builder = builder;
    }

    @Bean
    public RouterFunction<ServerResponse> authRotues(AuthHandler handler) {
        String signIn = builder.buildUri("auth", "signIn");
        return route(POST(signIn), handler::signIn);
    }
}
