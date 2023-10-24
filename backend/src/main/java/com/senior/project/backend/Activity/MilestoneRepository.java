package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.YearLevel;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Repository
public class MilestoneRepository {

    private static final List<Milestone> DATA = new ArrayList<>();

    static {
        Task task1 = Task.builder()
                .id("Task 1 id")
                .description("Task 1 description")
                .needsArtifact(true)
                .isRequired(false)
                .build();
        Task task2 = Task.builder()
                .id("Task 2 id")
                .description("Task 2 description")
                .needsArtifact(true)
                .isRequired(true)
                .build();
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);

        Milestone m1 = Milestone.builder()
                .milestoneID("milestone 1")
                .name("Milestone 1")
                .isActive(false)
                .yearLevel(YearLevel.Freshman)
                .events(EventRepository.DATA)
                .tasks(tasks)
                .build();
        DATA.add(m1);
        Milestone m2 = Milestone.builder()
                .milestoneID("milestone 2")
                .name("Milestone 2")
                .isActive(false)
                .yearLevel(YearLevel.Junior)
                .events(EventRepository.DATA)
                .tasks(tasks)
                .build();
        DATA.add(m2);
    }

    public Flux<Milestone> all() {
        return Flux.fromIterable(DATA);
    }
}
