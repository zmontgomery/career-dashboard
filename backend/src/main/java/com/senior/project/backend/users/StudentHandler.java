package com.senior.project.backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.domain.User;

import reactor.core.publisher.Mono;

/**
 * Handler for users
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
@Component
public class StudentHandler extends UserHandler{
    @Autowired
    private StudentService service;

    /**
     * Gets all students from the student service
     * @param serverRequest - request
     * @return 200 with body of all students
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(service.allStudents(), User.class);
    }
}
