package com.senior.project.backend.security;

import java.time.Instant;
import java.util.Date;

import org.jose4j.jwt.NumericDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TempUser;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;

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
    

    /**
     * Generates a login response based on the session
     * @param session - the corresponding session
     * @return the login resposne
     */
    public Mono<LoginResponse> login(TempUser user) {
        return generateResponse(user);
    }

    public Mono<LoginResponse> refreshToken(String token) throws TokenVerificiationException {
        Long expDate = tokenGenerator.extractExpDate(token).getValueInMillis();

        // Don't need to check if expired, extracting the expiry date will throw an error if it
        // is expired
        if (expDate - System.currentTimeMillis() < minToMilli(10)) { 
            return findUserFromToken(token).flatMap(this::generateResponse);
        } else {
            throw new TokenVerificiationException("Token does not need refreshed");
        }
    }

    public Mono<TempUser> findUserFromToken(String token) throws TokenVerificiationException {
        String email = this.tokenGenerator.extractEmail(token);
        return findUserByEmailAdress(email);
    }

    private Mono<LoginResponse> generateResponse(TempUser user) {
        return Mono.just(
            LoginResponse.builder()
                .user(user)
                .token(tokenGenerator.generateToken(user))
                .build()
        );
    }

    private Mono<TempUser> findUserByEmailAdress(String email) {
        return Mono.just(TempUser.builder().email(email).build());
    }

    private long minToMilli(long min) {
        return min * 60 * 1000;
    }
}
