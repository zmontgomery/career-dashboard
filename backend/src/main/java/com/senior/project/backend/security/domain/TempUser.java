package com.senior.project.backend.security.domain;

public class TempUser {
    public final String name;
    public final String email;
    public final String role;

    public TempUser(String name, String email, String role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
