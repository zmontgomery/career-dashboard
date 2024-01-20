package com.senior.project.backend.security.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class LoginResponseTest {
    private static final String TOKEN = "token";

    private LoginResponse CuT;

    public LoginResponseTest() {
        CuT = LoginResponse.builder().token(TOKEN).build();
    }

    @Test
    public void testGetters() {
        assertEquals(CuT.getToken(), TOKEN);
    }
}
