package com.senior.project.backend.users;

import org.springframework.beans.factory.annotation.Autowired;

import com.senior.project.backend.domain.User;

import reactor.core.publisher.Flux;

/**
 * Service that interacts with the faculty repository
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
public class FacultyService extends UserService{
    @Autowired
    private FacultyRepository repository;

    /**
     * Gets all faculty from the database
     * @return all the faculty
     */
    public Flux<User> allFaculty() {
        return Flux.fromIterable(repository.findAll());
    }
}
