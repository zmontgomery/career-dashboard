package com.senior.project.backend.users;

import java.util.Optional;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
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
public class UserService implements ReactiveUserDetailsService {
    @Autowired
    private UserRepository repository;

    /**
     * Gets all users from the database
     * @return all the users
     */
    public Flux<User> allUsers() {
        return Flux.fromIterable(repository.findAll());
    }

    /**
     * Retrieves a user from the database using their email address
     * @param email - the email address belonging to the user
     * @return the user
     * @throws EntityNotFoundException if the user with the provided email does not exist
     */
    public Mono<User> findByEmailAddress(String email) throws EntityNotFoundException {
        Optional<User> user = repository.findUserByEmail(email);
        LoggerFactory.getLogger(getClass()).info(email);
        if (user.isPresent()) {
            return Mono.just(user.get());
        } else {
            throw new EntityNotFoundException();
        }
    }

    /**
     * Loads a user from their email address
     * @param username the email of the user
     * @return the user as a userdetails object
     */
    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return findByEmailAddress(username)
            .map((u) -> (UserDetails) u);
    }
}
