package com.senior.project.backend.users;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

/**
 * Routes for the students
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
@Component
public class StudentRouter {
    @Bean
    public RouterFunction<ServerResponse> userRoutes(StudentHandler studentHandler) {
        return route(GET("/api/students"), studentHandler::all);
    }
}
