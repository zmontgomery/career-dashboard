package com.senior.project.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.server.WebSession;

import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.users.UserService;

import reactor.core.publisher.Mono;

/**
 * Auth service that interacts with the session repository
 * 
 * @author Jimmy Logan jrl9984@rit.edu
 */
@Service
public class AuthService {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private TokenGenerator tokenGenerator;

    @Autowired
    private UserService userService;

    /**
     * Generates a login response based on the session
     * @param session - the corresponding session
     * @return the login resposne
     */
    public Mono<LoginResponse> login(User user) {
        return generateResponse(user);
    }

    /**
     * Refreshes a given token by checking if it is within the refresh range
     * @param token - token being checked
     * @return - a Login Response with a new token
     * @throws TokenVerificiationException when token does not need refreshed
     */
    public Mono<LoginResponse> refreshToken(String token) throws TokenVerificiationException {
        long expDate = tokenGenerator.extractExpDate(token).getValueInMillis();

        // Don't need to check if expired, extracting the expiry date will throw an error if it
        // is expired
        if (expDate - System.currentTimeMillis() < minToMilli(20)) { 
            return findUserFromToken(token)
                .switchIfEmpty(Mono.empty())
                .flatMap(this::generateResponse);
        } else {
            throw new TokenVerificiationException("Token does not need refreshed");
        }
    }

    /**
     * Finds a user from a given token by attempting to extract the email address
     * @param token - token being analyzed
     * @return the new user from the email address
     * @throws TokenVerificiationException
     */
    public Mono<User> findUserFromToken(String token) throws TokenVerificiationException {
        String email = this.tokenGenerator.extractEmail(token);
        return userService.findByEmailAddress(email);
    }

    /**
     * Signs out a user by removing their session
     */
    public Mono<Void> signOut(ServerRequest request) {
        return request.session().flatMap(WebSession::invalidate);
    }

    /**
     * Generates a login response with a user
     * @param user - user in the response
     * @return A login response containing a new token and a user
     */
    private Mono<LoginResponse> generateResponse(User user) {
        return Mono.just(
            LoginResponse.builder()
                .user(user)
                .token(tokenGenerator.generateToken(user))
                .build()
        );
    }

    /**
     * Gets the current user within the auth service
     * 
     * Use this version in handler functions for testing purposes
     * @return
     */
    public Mono<User> currentUser() {
        return SecurityUtil.getCurrentUser();
    }

    /**
     * Convers minutes to milliseconds
     * @param min
     * @return
     */
    private long minToMilli(long min) {
        return min * 60 * 1000;
    }
}
