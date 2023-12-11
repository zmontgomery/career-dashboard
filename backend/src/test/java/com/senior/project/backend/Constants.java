package com.senior.project.backend;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.YearLevel;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class Constants {

    public static final List<Event> eventDATA = new ArrayList<>();

    public static Event e1;
    public static Event e2;
    public static Event e3;

    public static Milestone m1 = new Milestone();
    public static Milestone m2 = new Milestone();

    public static Task task1;
    public static Task task2;
    public static Task task3;

    static {
        e1 = new Event();
        e1.setId(1L);
        e1.setName("Major/Minor & Career Exploration Event");
        e1.setIsRequired(true);
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());

        e2 = new Event();
        e2.setId(1L);
        e2.setName("Attend Job Fair Fall Semester");
        e2.setIsRequired(true);
        e2.setDescription("Event 1 description");
        e2.setDate(new Date());

        e3 = new Event();
        e3.setId(1L);
        e3.setName("Attend Job Fair Spring Semester");
        e3.setIsRequired(true);
        e3.setDescription("Event 1 description");
        e3.setDate(new Date());
    }

    public static final List<Milestone> milestoneDATA = new ArrayList<>();

    static {
        task1 = new Task(1L,
                "Major and Class Schedule",
                "Meet with academic advisor to discuss current major and class schedule",
                true,
                m1);

        task2 = new Task(2L,
                "Complete Degreeworks Training",
                "Detailed description here",
                true,
                m1);
        task3 = new Task(3L,
                "Registration PIN meeting",
                "Meet with academic advisor to discuss class schedule and receive PIN for registration",
                true,
                m1);
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
        milestoneDATA.add(m1);


        var events2 = new ArrayList<Event>();
        events2.add(e2);
        events2.add(e3);

        List<Task> tasks2 = new ArrayList<>();
        tasks2.add(task3);

        m2.setId(2L);
        m2.setName("Major/Minor Exploration");
        m2.setYearLevel(YearLevel.Junior);
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

    public static User user1;
    public static User user2;

    public static final List<User> USERS = new ArrayList<>();

    static {
        user1 = new User();
        user1.setId(UUID.randomUUID());
        user1.setEmail("test@test.com");
        user2 = new User();
        user2.setId(UUID.randomUUID());
        user2.setEmail("test2@test.com");

        USERS.add(user1);
        USERS.add(user2);
    }
}






