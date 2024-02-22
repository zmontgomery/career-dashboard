package com.senior.project.backend.util;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Arrays;

/**
 * Enum for endpoints in the system and if they are accessible
 */
public enum Endpoints {
    // Events
    EVENTS("events", true),
    DASHBOARD_EVENTS("dashboard_events", true),
    CREATE_MILESTONE("admin/create-milestone", true, Role.ADMIN),
    CREATE_TASK("admin/create-task", true, Role.ADMIN),
    SEARCH_USERS("users/search", true, Role.FACULTY),
    PORTFOLIO("portfolio", true),
    ARTIFACT_LIST("portfolio/artifacts", true),
    SINGLE_ARTIFACT("portfolio/{artifactID}", true),

    // TODO remove this
    EMAIL("send-email", false),

    // Tasks
    TASKS("tasks", true),
    TASK_BY_ID("tasks/{id}", true),
    EDIT_TASK("admin/edit-task", true, Role.ADMIN),

    // Milestones
    MILSTONES("milestones", true),
    EDIT_MILESTONE("admin/edit-milestone", true, Role.ADMIN),

    // Users
    USERS("users", true),
    CURRENT_USER("current-user", true),

    // Submissions
    SUBMISSION("tasks/submission", true),
    LATEST_SUBMISSION("tasks/submission/{taskId}", true),

    // Artifacts
    ARTIFACT("artifact/", true),
    ARTIFACT_ID("artifact/{id}", true),
    ARTIFACT_FILE("artifact/file/{artifactID}", true),

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
    private Role role;

    Endpoints(String value, boolean needsAuthentication) {
        this.value = "/api/" + value;
        this.needsAuthentication = needsAuthentication;
        this.role = Role.STUDENT;
    }

    private Endpoints(String value, boolean needsAuthentication, Role role) {
        this.value = "/api/" + value;
        this.needsAuthentication = needsAuthentication;
        this.role = role;
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

    public Role getRole() {
        return role;
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
            .map(Endpoints::uri)
            .toList();

        String[] routes = new String[list.size()];
        for (int i = 0; i < routes.length; i++) {
            routes[i] = list.get(i);
        }

        return routes;
    }

    /**
     * Gets all admin routes
     */
    public static String[] getAdminRoutes() {
        List<String> list = Arrays.stream(Endpoints.values())
            .filter(r -> r.getRole() == Role.ADMIN)
            .map((r) -> r.uri())
            .toList();

        String[] routes = new String[list.size()];
        for (int i = 0; i < routes.length; i++) {
            routes[i] = list.get(i);
        }

        return routes;
    }

    public static String[] getFacultyRoutes() {
        List<String> list = Arrays.stream(Endpoints.values())
        .filter(r -> r.getRole() == Role.ADMIN || r.getRole() == Role.FACULTY)
        .map((r) -> r.uri())
        .toList();

        String[] routes = new String[list.size()];
        for (int i = 0; i < routes.length; i++) {
            routes[i] = list.get(i);
        }

        return routes;
    }

    public enum Role {
        STUDENT,
        ADMIN,
        FACULTY
    }
}
