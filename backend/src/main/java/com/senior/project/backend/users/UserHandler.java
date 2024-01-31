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
 * @author Jim Logan - jrl9984@rit.edu
 */
@Component
public class UserHandler {
    @Autowired
    private UserService service;

    /**
     * Gets all users from the user service
     * @param serverRequest - request
     * @return 200 with body of all users
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(service.allUsers(), User.class);
    }
}
