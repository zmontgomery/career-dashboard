package com.senior.project.backend;

import com.senior.project.backend.domain.*;

import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.slf4j.LoggerFactory;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

public class Constants {

    public static final List<Event> EVENT_LIST = new ArrayList<>();

    public static Event e1;
    public static Event e2;
    public static Event e3;

    public static Milestone m1 = new Milestone();
    public static Milestone m2 = new Milestone();

    public static Task task1;
    public static Task task2;
    public static Task task3;
    public static Task task4;
    public static Task task5;

    static {
        e1 = new Event();
        e1.setId(1L);
        e1.setName("Major/Minor & Career Exploration Event");
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());
        e1.setOrganizer("SUNY Oswego");
        e1.setLocation("Field House");
        e1.setRecurring(true);
        e1.setEventLink("Test Link");
        e1.setButtonLabel("More Info");
        e1.setImageId(1L);

        e2 = new Event();
        e2.setId(2L);
        e2.setName("Attend Job Fair Fall Semester");
        e2.setDescription("Event 1 description");
        e2.setDate(new Date());
        e2.setOrganizer("SUNY Oswego");
        e2.setLocation("Field Houes");
        e2.setRecurring(true);
        e2.setEventLink("Test Link");
        e2.setButtonLabel("More Info");

        e3 = new Event();
        e3.setId(3L);
        e3.setName("Attend Job Fair Spring Semester");
        e3.setDescription("Event 1 description");
        e3.setDate(new Date());
        e3.setOrganizer("SUNY Oswego");
        e3.setLocation("Field Houes");
        e3.setRecurring(true);
        e3.setEventLink("Test Link");
        e3.setButtonLabel("More Info");
    }

    public static final List<Milestone> milestoneDATA = new ArrayList<>();

    static {
        task1 = new Task(1L,
                "Major and Class Schedule",
                "Meet with academic advisor to discuss current major and class schedule",
                true,
                YearLevel.Freshman,
                TaskType.ARTIFACT,
                "Meeting Notes",
                "instructions",
                m1,
                null);

        task2 = new Task(2L,
                "Complete Degreeworks Training",
                "Detailed description here",
                true,
                YearLevel.Freshman,
                TaskType.ARTIFACT,
                "Degreeworks Result",
                "instructions",
                m1,
                null);

        task3 = new Task(3L,
                "Registration PIN meeting",
                "Meet with academic advisor to discuss class schedule and receive PIN for registration",
                true,
                YearLevel.Freshman,
                TaskType.ARTIFACT,
                "Registration PIN",
                "instructions",
                m1,
                null);

        task4 = new Task(4L,
                "Attend Job Fair",
                "task 4 description",
                true,
                YearLevel.Freshman,
                TaskType.EVENT,
                null,
                "instructions",
                null,
                e2);

        task5 = new Task(5L,
                "Create linkedin profile",
                "task 5 description",
                true,
                YearLevel.Freshman,
                TaskType.COMMENT,
                null,
                "instructions",
                null,
                null);

        //TODO: eventually add and test some event tasks
    }

    static {
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);
        var events = new ArrayList<Event>();
        events.add(e1);
        m1.setId(1L);
        m1.setName("Major Exploration");
        m1.setYearLevel(YearLevel.Freshman);
        m1.setDescription("Description of milestone 1");
        milestoneDATA.add(m1);

        EVENT_LIST.add(e2);
        EVENT_LIST.add(e3);

        List<Task> tasks2 = new ArrayList<>();
        tasks2.add(task3);

        m2.setId(2L);
        m2.setName("Major/Minor Exploration");
        m2.setYearLevel(YearLevel.Junior);
        m2.setDescription("Description of milestone 2");
        milestoneDATA.add(m2);
    }

    public static final List<Event> DATA = new ArrayList<>();
    public static final List<Event> DASH_DATA = new ArrayList<>();

    static {
        DATA.add(e1);
        DASH_DATA.add(e1);
        DATA.add(e2);
        DASH_DATA.add(e2);
        DASH_DATA.add(e3);
    }

    public static Mono<ServerResponse> handle(ServerRequest req) {
        LoggerFactory.getLogger(Constants.class).info("Ok");
        return ServerResponse.ok().build();
    }

    public static Mono<ServerResponse> handleFail(ServerRequest req) {
        LoggerFactory.getLogger(Constants.class).info("Fail");
        return ServerResponse.status(401).build();
    }

    public static User user1;
    public static User user2;

    public static final List<User> USERS = new ArrayList<>();

    static {
        user1 = new User();
        user1.setId(UUID.randomUUID());
        user1.setEmail("test@test.com");
        user1.setRole(Role.Admin);
        user1.setSignedUp(false);
        user2 = new User();
        user2.setId(UUID.randomUUID());
        user2.setEmail("test2@test.com");
        user2.setSignedUp(true);
        user2.setRole(Role.Faculty);

        USERS.add(user1);
        USERS.add(user2);
    }

    public static Artifact artifact1;
    public static Artifact artifact2;
    public static final List<Artifact> ARTIFACTS = new ArrayList<>();

    static {
        artifact1 = new Artifact();
        artifact1.setName("artifact 1 name");
        artifact1.setId(2);
        artifact1.setFileLocation("../uploads/artifactServiceTest");
        artifact1.setUserId(user1.getId());
        artifact2 = new Artifact();
        artifact2.setName("artifact 2 name");
        artifact2.setId(3);
        artifact2.setFileLocation("../uploads/location 2");
        artifact2.setUserId(user2.getId());
        ARTIFACTS.add(artifact1);
        ARTIFACTS.add(artifact2);
    }

    public static Submission submission1;
    public static Submission submission2;
    public static final List<Submission> SUBMISSIONS = new ArrayList<>();

    static {
        submission1 = new Submission();
        submission1.setId(1);
        submission1.setArtifactId(2);
        submission1.setTaskId(1);
        submission1.setComment("comment");
        submission1.setSubmissionDate(Date.from(Instant.now()));
        submission2 = new Submission();
        submission2.setId(2);
        submission2.setArtifactId(3);
        submission2.setTaskId(2);
        submission2.setComment("comment 2");
        submission2.setSubmissionDate(Date.from(Instant.now().plusMillis(100000)));
        SUBMISSIONS.add(submission1);
        SUBMISSIONS.add(submission2);
    }

}
