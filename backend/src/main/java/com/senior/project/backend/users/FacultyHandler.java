package com.senior.project.backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.domain.User;

import reactor.core.publisher.Mono;

/**
 * Handler for faculty
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
public class FacultyHandler extends UserHandler{
    @Autowired
    private FacultyService service;

    /**
     * Gets all faculty from the faculty service
     * @param serverRequest - request
     * @return 200 with body of all faculty
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(service.allFaculty(), User.class);
    }
}
