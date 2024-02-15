package com.senior.project.backend.users;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.Endpoints;

/**
 * Routes for the users
 * 
 * @author Jim Logan - jrl9984@rit.edu
 */
@Component
public class UserRouter {
    @Bean
    public RouterFunction<ServerResponse> userRoutes(UserHandler userHandler) {
        return route(GET(Endpoints.USERS.uri()), userHandler::all)
            .andRoute(GET(Endpoints.CURRENT_USER.uri()), userHandler::currentUser);
    }
}
