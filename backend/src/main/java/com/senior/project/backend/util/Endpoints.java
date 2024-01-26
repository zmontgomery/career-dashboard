package com.senior.project.backend.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Enum for endpoints in the system and if they are accessible
 */
public enum Endpoints {
    // Domain
    EVENTS("events", true),
    DASHBOARD_EVENTS("dashboard_events", true),
    MILSTONES("milestones", true),
    TASKS("tasks", true),
    RESUME("Portfolio/Resume", true),

    // Security
    SIGNIN("auth/signin", false),
    REFRESH("auth/refresh", true),
    FAILURE("auth/fail", false),

    // Test -- ONLY USE FOR UNIT TESTS --
    TEST_NEEDS_AUTH("test/yes", true),
    TEST_NO_AUTH("tests/no", false);

    private String value;
    private boolean needsAuthentication;

    private Endpoints(String value, boolean needsAuthentication) {
        this.value = "/api/" + value;
        this.needsAuthentication = needsAuthentication;
    }

    //
    // Getters
    //

    public String uri() {
        return value;
    }

    public boolean getNeedsAuthentication() {
        return needsAuthentication;
    }

    //
    // Static
    //

    // The map of the path to the endpoint
    public static Map<String, Endpoints> stringToEndpoint = new HashMap<>() {{
        for (Endpoints e : Endpoints.values()) {
            put(e.uri(), e);
        }
    }};

    /**
     * Converts a string to the endpoint
     */
    public static Endpoints toEndpoint(String path) {
        return stringToEndpoint.get(path);
    }
}
