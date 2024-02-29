package com.senior.project.backend.security;

import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.senior.project.backend.domain.User;

import reactor.core.publisher.Mono;

/**
 * Utility class for security purposes
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public abstract class SecurityUtil {

    /**
     * Retrieves the current user from the security context
     * @return a mono containing the current user
     */
    public static Mono<User> getCurrentUser() {
        return ReactiveSecurityContextHolder.getContext()
            .map(context -> (User) context.getAuthentication().getPrincipal())
            .onErrorMap(er -> new UsernameNotFoundException("No user found in context."));
    }
}
