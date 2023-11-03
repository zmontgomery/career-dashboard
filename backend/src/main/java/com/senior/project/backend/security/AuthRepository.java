package com.senior.project.backend.security;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Mono;

/**
 * This will store user emails with their token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class AuthRepository {
    private static final Map<String, TempUser> DATA = new HashMap<String, TempUser>();
    private static final List<TempUser> USERS = new LinkedList<>();

    public static final TempUser tempUser1;
    public static final TempUser tempUser2;

    static {

        tempUser1 = new TempUser("54c7d394-67a4-43d4-8673-980b52564c71", "Test User", "testuser@test.com", "faculty");
        tempUser2 = new TempUser("", "Test User 2", "testuser@test.com", "user");

        USERS.add(tempUser1);
        USERS.add(tempUser2);
    }

    public TempUser findUserByOid(String email) {
        for (TempUser user : USERS) {
            if (user.oid.equals(email)) return user;
        }
        return null;
    }

    public Mono<LoginResponse> addToken(String token, String oid) { // Token should be verified by now
        TempUser user = findUserByOid(oid);
        DATA.put(token, user);
        return Mono.just(new LoginResponse(token, user));
    }
}
