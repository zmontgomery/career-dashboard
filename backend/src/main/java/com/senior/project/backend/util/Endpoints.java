package com.senior.project.backend.util;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Arrays;

/**
 * Enum for endpoints in the system and if they are accessible
 */
public enum Endpoints {
    // Domain
    EVENTS("events", true),
    DASHBOARD_EVENTS("dashboard_events", true),
    MILSTONES("milestones", true),
    TASKS("tasks", true),
    RESUME("portfolio/resume", true),
    USERS("users", true),
    CURRENT_USER("current-user", true),
    EDIT_TASK("admin/edit-task", true),
    EDIT_MILESTONE("admin/edit-milestone", true),

    // Security
    SIGNIN("auth/signin", false),
    SIGNOUT("auth/signout", false),
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

    /**
     * Gets all open routes
     */
    public static String[] getOpenRoutes() {
        List<String> list = Arrays.stream(Endpoints.values())
            .filter(r -> !r.getNeedsAuthentication())
            .map((r) -> r.uri())
            .toList();

        String[] routes = new String[list.size()];
        for (int i = 0; i < routes.length; i++) {
            routes[i] = list.get(i);
        }

        return routes;
    }
}
