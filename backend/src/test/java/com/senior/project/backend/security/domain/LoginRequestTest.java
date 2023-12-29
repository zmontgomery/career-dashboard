package com.senior.project.backend.security.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class LoginRequestTest {
    private static final String TOKEN = "Token";
    private static final TokenType TYPE = TokenType.GOOGLE;

    private LoginRequest CuT;

    public LoginRequestTest() {
        CuT = new LoginRequest(TOKEN, TYPE);
    }

    @Test
    public void testGetters() {
        assertEquals(CuT.getIdToken(), TOKEN);
        assertEquals(CuT.getType(), TYPE);
    }
}
