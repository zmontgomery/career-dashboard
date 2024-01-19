package com.senior.project.backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.User;

import reactor.core.publisher.Flux;

/**
 * Service that interacts with the user repository
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Service
public class UserService {
    @Autowired
    private UserRepository repository;

    /**
     * Gets all users from the database
     * @return all the users
     */
    public Flux<User> allUsers() {
        return Flux.fromIterable(repository.findAll());
    }
}
