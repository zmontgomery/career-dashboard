package com.senior.project.backend.security;

import java.util.Date;
import java.time.Instant;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Mono;

@Service
public class AuthService {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private AuthRepository repository;

    public Mono<Session> retrieveSession(String sessionID) {
        return repository.findSessionBySessionID(sessionID);
    }

    public Mono<Session> createSession(TempUser user) {
        Date now = new Date(Instant.now().toEpochMilli());
        UUID sessionId = UUID.randomUUID();

        Session session = Session.builder()
            .user(user)
            .signInDate(now)
            // Add a day to the expiration 
            .expiryDate(Date.from(now.toInstant().plusSeconds(86400)))
            .sessionID(sessionId)
            .build();

        return repository.addSession(session);
    }

    public Mono<Session> deleteSession(String sessionID) {
        return retrieveSession(sessionID).flatMap(session -> repository.deleteSession(session));
    }

    /**
     * Deletes the old session and generates a new one for the user
     */
    public Mono<Session> refreshSession(String sessionID) {
        return repository.findSessionBySessionID(sessionID)
            .flatMap(session -> 
                repository.deleteSession(session)
                    .flatMap(v -> createSession(session.getUser()))
            );
    }
}
