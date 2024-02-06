package com.senior.project.backend.users;

import java.util.Optional;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.Faculty;
import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service that interacts with the faculty repository
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
@Service
public class FacultyService{
    @Autowired
    private FacultyRepository repository;

    /**
     * Gets all faculty from the database
     * @return all the faculty
     */
    public Flux<Faculty> allFaculty() {
        return Flux.fromIterable(repository.findAll());
    }
}
