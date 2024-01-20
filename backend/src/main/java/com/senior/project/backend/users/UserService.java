package com.senior.project.backend.users;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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

    public Mono<User> findByEmailAddress(String email) throws EntityNotFoundException {
        Optional<User> user = repository.findUserByEmail(email);
        if (user.isPresent()) {
            return Mono.just(user.get());
        } else {
            throw new EntityNotFoundException();
        }
    }
}
