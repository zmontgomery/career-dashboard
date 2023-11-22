package com.senior.project.backend.security;

import java.util.Date;
import java.util.Optional;
import java.time.Instant;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Flux;
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
    private AuthRepository repository;

    /**
     * Retreives all sessions
     * 
     * @return all sessions
     */
    public Flux<Session> all() {
        return Flux.fromIterable(repository.findAll());
    }

    /**
     * Retreives a session from its ID
     * @param sessionID - UUID as string
     * @return the session
     */
    public Mono<Session> retrieveSession(String sessionID) {
        return Mono.just(repository.findById(UUID.fromString(sessionID)).get());
    }

    /**
     * Creates a new session
     * @param email - the user's email address
     * @return the created session
     */
    public Mono<Session> createSession(String email) {
        Date now = new Date(Instant.now().toEpochMilli());

        sessionExistsCheck(email);

        Session session = Session.builder()
            .email(email)
            .signInDate(now)
            // Add a day to the expiration 
            .expiryDate(Date.from(now.toInstant().plusSeconds(86400)))
            .build();

        return Mono.just(repository.saveAndFlush(session));
    }

    /**
     * Generates a login response based on the session
     * @param session - the corresponding session
     * @return the login resposne
     */
    public Mono<LoginResponse> generateResponse(Session session) {
        return Mono.just(
            LoginResponse.builder()
                .sessionID(session.getId())
                .user(TempUser.builder().email(session.getEmail()).build())
                .build()
        );
    }

    /**
     * Deteles a session based on its id
     * @param sessionID - the UUID of the session being deleted as a string
     * @return the deleted session
     */
    public Mono<Session> deleteSession(String sessionID) {
        return retrieveSession(sessionID)
            .map(session -> {
                repository.deleteById(UUID.fromString(sessionID));
                logger.info("Deleted");
                session.setValid(false);
                return session;
            });
    }

    /**
     * Helper delete a session if one for the email exists
     * @param email - email for the session
     */
    private void sessionExistsCheck(String email) {
        Optional<Session> session = repository.findSessionByEmail(email);

        if (session.isPresent()) {
            deleteSession(session.get().getId().toString()).subscribe();
        }
    }
}
