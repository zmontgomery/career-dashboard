package com.senior.project.backend.security.domain;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SessionTest {
    private static final String EMAIL = "test@test.com";
    private static final UUID ID = UUID.randomUUID();

    private static final int DAY = 86400;
    private static final int REFRESH_RANGE = 1800;

    private static Session CuTHappy;
    private static Session CuTExpired;
    private static Session CuTRefreshable;

    @BeforeEach
    public void setUp() {
        CuTHappy = Session.builder()
            .email(EMAIL)
            .id(ID)
            .signInDate(Date.from(Instant.now()))
            .expiryDate(Date.from(Instant.now().plusSeconds(DAY)))
            .build();

        CuTExpired = Session.builder()
            .email(EMAIL)
            .id(ID)
            .signInDate(Date.from(Instant.now()))
            .expiryDate(Date.from(Instant.now().minusSeconds(1000)))
            .build();

        CuTRefreshable = Session.builder()
            .email(EMAIL)
            .id(ID)
            .signInDate(Date.from(Instant.now()))
            .expiryDate(Date.from(Instant.now().plusSeconds(REFRESH_RANGE)))
            .build();
    }

    @Test
    public void testGettersHappy() {
        assertEquals(CuTHappy.getEmail(), EMAIL);
        assertEquals(CuTHappy.getId(), ID);
    }

    @Test
    public void testHappyNotExpired() {
        assertFalse(CuTHappy.isExpired());
    }

    @Test void testHappyNotRefreshed() {
        assertFalse(CuTHappy.isInRefreshRange());
    }

    @Test
    public void testExpired() {
        assertTrue(CuTExpired.isExpired());
    }

    @Test void testExpiredNotRefreshed() {
        assertFalse(CuTExpired.isInRefreshRange());
    }

    @Test
    public void testRefreshNotExpired() {
        assertFalse(CuTRefreshable.isExpired());
    }

    @Test void testRefreshed() {
        assertTrue(CuTRefreshable.isInRefreshRange());
    }

}
