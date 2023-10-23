package com.senior.project.backend.security.domain;

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
