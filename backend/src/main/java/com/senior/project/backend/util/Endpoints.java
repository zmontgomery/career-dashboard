package com.senior.project.backend.util;

import java.util.HashMap;
import java.util.Map;

public enum Endpoints {
    // Domain
    EVENTS("events", true),
    DASHBOARD_EVENTS("dashboard_events", true),
    MILSTONES("milestones", true),

    // Security
    SIGNIN("auth/signIn", false),
    REFRESH("auth/refresh", true),

    // Test -- ONLY USE FOR UNIT TESTS --
    TEST_NEEDS_AUTH("test/yes", true),
    TEST_NO_AUTH("tests/no", false);

    private String value;
    private boolean needsAuthentication;

    private Endpoints(String value, boolean needsAuthentication) {
        this.value = "/api/" + value;
        this.needsAuthentication = needsAuthentication;
    }

    public String uri() {
        return value;
    }

    public boolean getNeedsAuthentication() {
        return needsAuthentication;
    }

    public static Map<String, Endpoints> stringToEndpoint = new HashMap<>() {{
        for (Endpoints e : Endpoints.values()) {
            put(e.uri(), e);
        }
    }};

    public static Endpoints toEndpoint(String path) {
        return stringToEndpoint.get(path);
    }
}
