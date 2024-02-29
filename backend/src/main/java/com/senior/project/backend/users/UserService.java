package com.senior.project.backend.users;

import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

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
            .map((u) -> u);
    }

    /**
     * Searches for Users given the searchTerm and provides a paged response, based on the paging information
     * @param pageOffset current page to grab
     * @param pageSize size of pages to calculate offset and return size
     * @param searchTerm string of user partial name
     * @return List of Users matching the search with paged results
     */
    public Page<User> searchAndPageUsers(int pageOffset, int pageSize, String searchTerm) {
        Pageable pageable = PageRequest.of(pageOffset, pageSize);

        return repository.findByFullNameContainingIgnoreCase(searchTerm, pageable);
    }

    // Email for the super user
    @Value("${crd.superadmin}") private String superUser;

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

        findByEmailAddress(superUser)
            .switchIfEmpty(Mono.error(new UsernameNotFoundException(String.format("User %s is not in database.", superUser))))
            .subscribe((user) -> {
                user.setRole(Role.SuperAdmin);
                repository.save(user);
            });
    }
}
