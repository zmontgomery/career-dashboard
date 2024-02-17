package com.senior.project.backend.domain;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.senior.project.backend.AbstractDomainObjectTest;
import com.senior.project.backend.Pair;
import com.senior.project.backend.security.SecurityUtil;

public class UserTest extends AbstractDomainObjectTest<User> {
    private static final UUID id = UUID.randomUUID();
    private static final String email = "test@test.test";
    private static final String phoneNumber = "111-111-1111";
    private static final Date dateCreated = Date.from(Instant.now());
    private static final Date lastLogin = Date.from(Instant.now());
    private static final String firstName = "Test";
    private static final String lastName = "Testerson";
    private static final boolean canEmail = false;
    private static final boolean canText = false;
    private static final StudentDetails studentDetails = StudentDetails.builder().build();
    private static final boolean isAdmin = true;
    private static final boolean isStudent = true;
    private static final boolean isFaculty = true;
    private static final boolean isSuperAdmin = true;
    
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
                canText,
                studentDetails,
                isStudent,
                isAdmin,
                isFaculty,
                isSuperAdmin,
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
            new Pair<>("canText", canText),
            new Pair<>("isStudent", isStudent),
            new Pair<>("isFaculty", isFaculty),
            new Pair<>("isAdmin", isAdmin),
            new Pair<>("studentDetails", studentDetails),
            new Pair<>("student", isStudent),
            new Pair<>("faculty", isFaculty),
            new Pair<>("admin", isAdmin),
            new Pair<>("isSuperAdmin", isSuperAdmin),
            new Pair<>("superAdmin", isSuperAdmin)
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
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority(SecurityUtil.Roles.STUDENT.toString()),
            new SimpleGrantedAuthority(SecurityUtil.Roles.ADMIN.toString()),
            new SimpleGrantedAuthority(SecurityUtil.Roles.FACULTY.toString()),
            new SimpleGrantedAuthority(SecurityUtil.Roles.SUPER_ADMIN.toString())
        );
        assertEquals(email, CuT.getUsername());
        assertEquals("", CuT.getPassword());
        assertTrue(CuT.isAccountNonExpired());
        assertTrue(CuT.isAccountNonLocked());
        assertTrue(CuT.isCredentialsNonExpired());
        assertTrue(CuT.isEnabled());
        assertArrayEquals(authorities.toArray(), CuT.getAuthorities().toArray());
    }
}
