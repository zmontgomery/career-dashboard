package com.senior.project.backend.util;

public enum Endpoints {
    // Domain
    EVENTS("events", true),
    MILSTONES("milestones", true),

    // Security
    SIGNIN("auth/signIn", false);


    private String value;
    private boolean needsAuthentication;

    private Endpoints(String value, boolean needsAuthentication) {
        this.value = "/api/" + value;
        this.needsAuthentication = needsAuthentication;
    }

    public String getValue() {
        return value;
    }

    public boolean getNeedsAuthentication() {
        return needsAuthentication;
    }

    public static Endpoints toEndpoint(String path) {
        for (Endpoints e : Endpoints.values()) {
            if (e.getValue().equals(path)) return e;
        }
        return null;
    }
}
