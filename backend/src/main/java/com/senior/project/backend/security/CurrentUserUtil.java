package com.senior.project.backend.security;

import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.senior.project.backend.domain.User;

import reactor.core.publisher.Mono;

/**
 * Utility class for security purposes
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class CurrentUserUtil {

    /**
     * Retrieves the current user from the security context
     * @return a mono containing the current user
     */
    public Mono<User> getCurrentUser() {
        return ReactiveSecurityContextHolder.getContext()
            .map(context -> (User) context.getAuthentication().getPrincipal())
            .onErrorMap(er -> new UsernameNotFoundException("No user found in context."));
    }
}
