package com.senior.project.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.security.domain.Session;

import reactor.core.publisher.Mono;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;

    public Mono<Session> refreshSession(String sessionID) {
        return authRepository.findSessionBySessionID(sessionID);
    }
}
