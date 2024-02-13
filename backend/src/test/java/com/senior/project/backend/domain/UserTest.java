package com.senior.project.backend.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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
    private static final StudentDetails studentDetails = StudentDetails.builder().build();
    private static final boolean isAdmin = true;
    private static final boolean isStudent = true;
    private static final boolean isFaculty = true;
    
    public UserTest() {
        super(
            new User(
                id,
                email,
                phoneNumber,
                dateCreated,
                lastLogin,
                firstName,
                lastName,
                canEmail,
                canTest,
                isStudent,
                isAdmin,
                isFaculty,
                studentDetails
            ),
            new Pair<>("id", id),
            new Pair<>("email", email),
            new Pair<>("phoneNumber", phoneNumber),
            new Pair<>("dateCreated", dateCreated),
            new Pair<>("lastLogin", lastLogin),
            new Pair<>("firstName", firstName),
            new Pair<>("lastName", lastName),
            new Pair<>("canEmail", canEmail),
            new Pair<>("canText", canTest),
            new Pair<>("isStudent", isStudent),
            new Pair<>("isFaculty", isFaculty),
            new Pair<>("isAdmin", isAdmin),
            new Pair<>("studentDetails", studentDetails),
            new Pair<>("student", isStudent),
            new Pair<>("faculty", isFaculty),
            new Pair<>("admin", isAdmin)
        );
    }

    @Override
    protected List<String> excludedMethods() {
        return List.of(
            "getUsername",
            "getAuthorities",
            "getPassword",
            "isAccountNonExpired",
            "isAccountNonLocked",
            "isCredentialsNonExpired",
            "isEnabled"
        );
    }

    @Override
    protected Class<User> getTestClass() {
        return User.class;
    }

    @Test
    public void testUserDetails() {
        assertEquals(email, CuT.getUsername());
        assertEquals(List.of(new SimpleGrantedAuthority("USER")), CuT.getAuthorities());
        assertEquals("", CuT.getPassword());
        assertTrue(CuT.isAccountNonExpired());
        assertTrue(CuT.isAccountNonLocked());
        assertTrue(CuT.isCredentialsNonExpired());
        assertTrue(CuT.isEnabled());
    }
}
