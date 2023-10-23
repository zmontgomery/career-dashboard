package com.senior.project.backend.security.domain;

import com.senior.project.backend.security.domain.TempUser;

public class LoginResponse {
    private final String token;
    private final TempUser user;

    public LoginResponse(String token, TempUser user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public TempUser getUser() {
        return user;
    }
}
