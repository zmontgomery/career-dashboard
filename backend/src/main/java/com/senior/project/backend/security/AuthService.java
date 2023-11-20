package com.senior.project.backend.security;

import java.util.Date;
import java.time.Instant;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Mono;

@Service
public class AuthService {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private AuthRepository repository;

    public Mono<Session> retrieveSession(String sessionID) {
        return Mono.just(repository.findById(UUID.fromString(sessionID)).get());
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

        return Mono.just(repository.saveAndFlush(session));
    }

    public Mono<LoginResponse> generateResponse(Session session) {
        return Mono.just(
            LoginResponse.builder()
                .sessionID(session.getSessionID())
                .user(session.getUser())
                .build()
        );
    }

    public Mono<Session> deleteSession(String sessionID) {
        return retrieveSession(sessionID)
            .map(session -> {
                repository.deleteById(UUID.fromString(sessionID));
                return session;
            });
    }
}
