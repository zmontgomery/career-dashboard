package com.senior.project.backend.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.senior.project.backend.domain.Role;

/**
 * Enum for endpoints in the system and if they are accessible
 */
public enum Endpoints {
    // Events
    EVENTS("events", true),
    EDIT_EVENT("admin/edit-event", true, Role.Admin),
    CREATE_EVENT("admin/create-event", true, Role.Admin),
    DASHBOARD_EVENTS("dashboard-events", true),
    DASHBOARD_TASKS("dashboard-tasks", true),

    // Tasks
    TASKS("tasks", true),
    TASK_BY_ID("tasks/{id}", true),
    EDIT_TASK("admin/edit-task", true, Role.Admin),
    CREATE_TASK("admin/create-task", true, Role.Admin),

    // Milestones
    MILESTONES("milestones", true),
    MILESTONES_COMPLETE("milestones/complete", true),
    EDIT_MILESTONE("admin/edit-milestone", true, Role.Admin),
    CREATE_MILESTONE("admin/create-milestone", true, Role.Admin),

    // Users
    CURRENT_USER("current-user", true),
    USERS_BY_ID("users/{id}", true, Role.Faculty),
    UPDATE_ROLES("users/roles", true, Role.Faculty),
    SEARCH_USERS("users/search", true, Role.Faculty),
    PORTFOLIO("portfolio", true),

    // Portfolio
    EDUCATION("student/education", true),

    // Submissions
    SUBMISSION("tasks/submission", true),
    LATEST_SUBMISSION("tasks/submission/{taskId}", true),
    ALL_SUBMISSIONS("student/submission", true),
    FACULTY_SUBMISSIONS("faculty/milestones/{studentID}", true, Role.Faculty),

    // Artifacts
    ARTIFACT("artifact/", true),
    ARTIFACT_ID("artifact/{id}", true),
    ARTIFACT_FILE("artifact/file/{artifactID}", true),
    UPLOAD_IMAGE_EVENT("artifact/event/{eventID}", true, Role.Admin),
    IMAGE_EVENT("artifact/image/{artifactID}", false),
    USERS_PROFILE_PICTURE("artifact/profile-picture", true),
    RESUME("portfolio/resume", true),
    ARTIFACT_LIST("portfolio/artifacts", true),
    SINGLE_ARTIFACT("portfolio/{artifactID}", true),

    // Security
    SIGNIN("auth/signin", false),
    SIGNOUT("auth/signout", false),
    SIGNUP("auth/signup", true),
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
        this.role = Role.Student;
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
    public static Map<String, Endpoints> stringToEndpoint = new HashMap<>() {
        {
            for (Endpoints e : Endpoints.values()) {
                put(e.uri(), e);
            }
        }
    };

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
                .filter(r -> r.getRole() == Role.Admin)
                .map((r) -> r.uri())
                .toList();

        String[] routes = new String[list.size()];
        for (int i = 0; i < routes.length; i++) {
            routes[i] = list.get(i);
        }

        return routes;
    }

    /**
     * Gets all faculty routes
     */
    public static String[] getFacultyRoutes() {
        List<String> list = Arrays.stream(Endpoints.values())
                .filter(r -> r.getRole() == Role.Admin || r.getRole() == Role.Faculty)
                .map((r) -> r.uri())
                .toList();

        String[] routes = new String[list.size()];
        for (int i = 0; i < routes.length; i++) {
            routes[i] = list.get(i);
        }

        return routes;
    }
}
