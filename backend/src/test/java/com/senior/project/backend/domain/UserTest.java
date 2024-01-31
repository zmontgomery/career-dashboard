package com.senior.project.backend.domain;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import com.senior.project.backend.AbstractDomainObjectTest;
import com.senior.project.backend.Pair;

public class UserTest extends AbstractDomainObjectTest<User> {
    private static final UUID id = UUID.randomUUID();
    private static final String email = "test@test.test";
    private static final String phoneNumber = "111-111-1111";
    private static final Date dateCreated = Date.from(Instant.now());
    private static final Date lastLogin = Date.from(Instant.now());
    private static final String firstName = "Test";
    private static final String lastName = "Testerson";
    private static final boolean canEmail = false;
    private static final boolean canTest = false;
    
    public UserTest() {
        super(
            new User(id, email, phoneNumber, dateCreated, lastLogin, firstName, lastName, canEmail, canTest),
            new Pair<>("id", id),
            new Pair<>("email", email),
            new Pair<>("phoneNumber", phoneNumber),
            new Pair<>("dateCreated", dateCreated),
            new Pair<>("lastLogin", lastLogin),
            new Pair<>("firstName", firstName),
            new Pair<>("lastName", lastName),
            new Pair<>("canEmail", canEmail),
            new Pair<>("canText", canTest)
        );
    }
}
