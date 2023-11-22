package com.senior.project.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.AbstractRouter;
import com.senior.project.backend.util.Endpoints;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

/**
 * Endpoints for authentication
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Configuration
public class AuthRouter extends AbstractRouter {
    @Bean
    public RouterFunction<ServerResponse> authRotues(AuthHandler handler) {
        return wrapRoutes(route(POST(Endpoints.SIGNIN.getValue()), handler::signIn));
    }
}
