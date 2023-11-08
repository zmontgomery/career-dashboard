package com.senior.project.backend.security;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Mono;

/**
 * This will store user emails with their token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class AuthRepository {
    private static final List<Session> DATA = new LinkedList<>();
    private static final List<TempUser> USERS = new LinkedList<>();

    public static final TempUser tempUser1;
    public static final TempUser tempUser2;

    static {

        tempUser1 = new TempUser("54c7d394-67a4-43d4-8673-980b52564c71", "Test User", "jrl9984@g.rit.edu", "faculty");
        tempUser2 = new TempUser("", "Test User 2", "testuser@test.com", "user");

        USERS.add(tempUser1);
        USERS.add(tempUser2);
    }

    public TempUser findUserByEmail(String email) {
        for (TempUser user : USERS) {
            if (user.email.equals(email)) return user;
        }
        return null;
    }

    public boolean findSesstionByUser(TempUser user) {
        return DATA.stream().anyMatch(s -> user.getEmail().equals(s.getUser().getEmail()));
    }

    public Mono<LoginResponse> addSession(String email) throws Exception {
        TempUser user = findUserByEmail(email);
        Date now = new Date(Instant.now().toEpochMilli());
        UUID sessionId = UUID.randomUUID();

        Session session = Session.builder()
            .user(user)
            .signInDate(now)
            .sessionID(sessionId)
            .build();

        if (findSesstionByUser(user)) {
            throw new Exception("Session already exists");
        }

        DATA.add(session);

        return Mono.just(
            LoginResponse.builder()
                .sessionID(session.getSessionID())
                .user(session.getUser())
                .build()
        );
    }
}
