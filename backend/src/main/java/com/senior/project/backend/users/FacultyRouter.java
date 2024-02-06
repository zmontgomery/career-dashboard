package com.senior.project.backend.users;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.Endpoints;

/**
 * Routes for the faculty
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
@Component
public class FacultyRouter {
    @Bean
    public RouterFunction<ServerResponse> facultyRoutes(FacultyHandler facultyHandler) {
        return route(GET(Endpoints.FACULTY.uri()), facultyHandler::all);
    }
}
