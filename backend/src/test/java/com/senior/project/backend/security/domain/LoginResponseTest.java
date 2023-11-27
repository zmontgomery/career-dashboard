package com.senior.project.backend.security.domain;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class LoginResponseTest {
    private static final UUID ID = UUID.randomUUID();

    private LoginResponse CuT;

    public LoginResponseTest() {
        CuT = LoginResponse.builder().sessionID(ID).build();
    }

    @Test
    public void testGetters() {
        assertEquals(CuT.getSessionID(), ID);
    }
}
