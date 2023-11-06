package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.YearLevel;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class MilestoneRepository {

    private static final List<Milestone> DATA = new ArrayList<>();

    static {
        Task task1 = Task.builder()
                .id("Task 1 id")
                .description("Meet with academic advisor to discuss current major and class schedule")
                .needsArtifact(true)
                .isRequired(false)
                .build();
        Task task2 = Task.builder()
                .id("Task 2 id")
                .description("Complete Degreeworks Training")
                .needsArtifact(true)
                .isRequired(true)
                .build();
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);

        Event e1 = Event.builder().eventID("event 1")
                .name("Major/Minor & Career Exploration Event")
                .isRecurring(false)
                .organizer("Organizer 1")
                .location("Location 1")
                .isRequired(true).build();
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());
        var events = new ArrayList<Event>();
        events.add(e1);

        Milestone m1 = Milestone.builder()
                .milestoneID("milestone 1")
                .name("Major Exploration")
                .yearLevel(YearLevel.Freshman)
                .events(events)
                .tasks(tasks)
                .build();
        DATA.add(m1);


        Event e2 = Event.builder().eventID("event 1")
                .name("Attend Job Fair Fall Semester")
                .isRecurring(false)
                .organizer("Organizer 1")
                .location("Location 1")
                .isRequired(true).build();
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());
        Event e3 = Event.builder().eventID("event 1")
                .name("Attend Job Fair Spring Semester")
                .isRecurring(false)
                .organizer("Organizer 1")
                .location("Location 1")
                .isRequired(true).build();
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());
        var events2 = new ArrayList<Event>();
        events2.add(e2);
        events2.add(e3);

        Task task3 = Task.builder()
                .id("Task 3 id")
                .description("Meet with academic advisor to discuss class schedule and receive PIN for registration")
                .needsArtifact(true)
                .isRequired(true)
                .build();
        List<Task> tasks2 = new ArrayList<>();
        tasks2.add(task3);


        Milestone m2 = Milestone.builder()
                .milestoneID("milestone 2")
                .name("Major/Minor Exploration")
                .yearLevel(YearLevel.Junior)
                .events(events2)
                .tasks(tasks2)
                .build();
        DATA.add(m2);
    }

    public Flux<Milestone> all() {
        return Flux.fromIterable(DATA);
    }
}
