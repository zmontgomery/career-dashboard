package com.senior.project.backend.security.domain;

import com.senior.project.backend.security.domain.TokenType;

public class LoginRequest {
    private final String token;
    private final TokenType type;

    public LoginRequest(String token, TokenType type) {
        this.token = token;
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public TokenType getType() {
        return type;
    }
}
