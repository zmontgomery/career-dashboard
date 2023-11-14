package com.senior.project.backend.security;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Mono;

/**
 * This will store user emails with their token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
@Repository
public class AuthRepository {

    Logger logger = LoggerFactory.getLogger(getClass());

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

    public Mono<TempUser> findUserByEmail(String email) {
        for (TempUser user : USERS) {
            if (user.email.equals(email)) return Mono.just(user);
        }
        return Mono.just(tempUser1);
    }

    public Mono<Session> findSessionBySessionID(String id) {
        for (Session session : DATA) {
            if (session.getSessionID().equals(UUID.fromString(id))) {
                return Mono.just(session);
            }
        }
        return Mono.empty();
    }

    public boolean userHasSession(TempUser user) {
        return DATA.stream().anyMatch(s -> user.getEmail().equals(s.getUser().getEmail()));
    }

    public Mono<Session> addSession(Session session) {
        DATA.add(session);
        return Mono.just(session);
    }

    public Mono<Session> deleteSession(Session session) {
        DATA.remove(session);
        return Mono.just(session);
    }
}
