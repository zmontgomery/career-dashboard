package com.senior.project.backend.users;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.util.NonBlockingExecutor;

import jakarta.annotation.PostConstruct;
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
     *
     * @return all the users
     */
    public Flux<User> allUsers() {
        return NonBlockingExecutor.executeMany(() -> repository.findAll());
    }

    /**
     * Retrieves a user from the database using their email address
     *
     * @param email - the email address belonging to the user
     * @return the user
     */
    public Mono<User> findByEmailAddress(String email) {
        return NonBlockingExecutor.execute(() -> repository.findUserByEmail(email))
                .flatMap(user -> user.<Mono<? extends User>>map(Mono::just).orElseGet(Mono::empty));
    }

    /**
     * Retrieves a user from the database using their ID
     *
     * @param id id of the user
     * @return the user
     */
    public Mono<User> findById(UUID id) {
        return NonBlockingExecutor.execute(() -> repository.findById(id))
                .flatMap((user) -> user.<Mono<? extends User>>map(Mono::just).orElseGet(Mono::empty));
    }

    /**
     * Loads a user from their email address
     *
     * @param username the email of the user
     * @return the user as a userdetails object
     */
    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return findByEmailAddress(username)
                .map((u) -> u);
    }

    /**
     * Loads a user from their email address
     *
     * @param username the email of the user
     * @return the user object
     */
    public Mono<User> findByID(UUID userID) {
        Optional<User> potentialUser = repository.findById(userID);
        if (potentialUser.isEmpty()) {
            return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        }

        return Mono.just(potentialUser.get());
    }

    /**
     * Searches for Users given the searchTerm and provides a paged response, based
     * on the paging information
     *
     * @param pageOffset current page to grab
     * @param pageSize   size of pages to calculate offset and return size
     * @param searchTerm string of user partial name
     * @return List of Users matching the search with paged results
     */
    public Page<User> searchAndPageUsers(int pageOffset, int pageSize, String searchTerm) {
        Pageable pageable = PageRequest.of(pageOffset, pageSize);

        return repository.findByFullNameContainingIgnoreCase(searchTerm, pageable);
    }

    public Mono<User> createOrUpdateUser(User user) {
        // FIXME this should be done with the non blocking executor but it doesn't run
        // the code
        // return NonBlockingExecutor.execute(()-> repository.saveAndFlush(user));
        return Mono.just(repository.saveAndFlush(user));
    }

    // Email for the super user
    @Value("${crd.superadmin}")
    private String superUser;

    /**
     * Clears all super users and sets the super user specified
     * by the argument
     */
    @PostConstruct
    public void setSuperUser() {
        repository.findUsersByRole(Role.SuperAdmin)
                .forEach((u) -> {
                    u.setRole(Role.Admin);
                    repository.save(u);
                });

        var user = findByEmailAddress(superUser).block();

        if (user == null)
            throw new UsernameNotFoundException(String.format("User %s is not in database.", superUser));

        System.err.println(user);
        user.setRole(Role.SuperAdmin);
        repository.save(user);
    }
}
