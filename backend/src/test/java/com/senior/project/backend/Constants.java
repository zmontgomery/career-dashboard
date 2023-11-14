package com.senior.project.backend;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.YearLevel;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Constants {

    public static final List<Event> eventDATA = new ArrayList<>();

    static Event e1;
    static Event e2;
    static Event e3;

    static {
        e1 = new Event();
        e1.setId(1L);
        e1.setName("Major/Minor & Career Exploration Event");
        e1.setIsRecurring(false);
        e1.setOrganizer("Organizer 1");
        e1.setLocation("Location 1");
        e1.setIsRequired(true);
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());

        e2 = new Event();
        e2.setId(1L);
        e2.setName("Attend Job Fair Fall Semester");
        e2.setIsRecurring(false);
        e2.setOrganizer("Organizer 1");
        e2.setLocation("Location 1");
        e2.setIsRequired(true);
        e2.setDescription("Event 1 description");
        e2.setDate(new Date());

        e3 = new Event();
        e3.setId(1L);
        e3.setName("Attend Job Fair Spring Semester");
        e3.setIsRecurring(false);
        e3.setOrganizer("Organizer 1");
        e3.setLocation("Location 1");
        e3.setIsRequired(true);
        e3.setDescription("Event 1 description");
        e3.setDate(new Date());
    }

    private static final List<Milestone> milestoneDATA = new ArrayList<>();

    static Task task1;
    static Task task2;
    static Task task3;

    static {
        task1 = Task.builder()
                .id(1L)
                .name("Major and Class Schedule")
                .description("Meet with academic advisor to discuss current major and class schedule")
                .needsArtifact(true)
                .isRequired(false)
                .build();
        task2 = Task.builder()
                .id(2L)
                .name("Complete Degreeworks Training")
                .description("Detailed description here")
                .needsArtifact(true)
                .isRequired(true)
                .build();
        task3 = new Task();
        task3.setId(3L);
        task3.setName("Registration PIN meeting");
        task3.setDescription("Meet with academic advisor to discuss class schedule and receive PIN for registration");
        task3.setNeedsArtifact(true);
        task3.setIsRequired(true);
    }

    static {
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);
        var events = new ArrayList<Event>();
        events.add(e1);
        Milestone m1 = new Milestone();
        m1.setId(1L);
        m1.setName("Major Exploration");
        m1.setYearLevel(YearLevel.Freshman);
//        m1.setEvents(events);
//        m1.setTasks(tasks);
        milestoneDATA.add(m1);


        var events2 = new ArrayList<Event>();
        events2.add(e2);
        events2.add(e3);

        List<Task> tasks2 = new ArrayList<>();
        tasks2.add(task3);


        Milestone m2 = new Milestone();
        m2.setId(2L);
        m2.setName("Major/Minor Exploration");
        m2.setYearLevel(YearLevel.Junior);
//        m2.setEvents(events2);
//        m2.setTasks(tasks2);
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
}






