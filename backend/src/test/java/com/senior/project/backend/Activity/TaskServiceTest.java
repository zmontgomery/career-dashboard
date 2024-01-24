package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Task;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import java.util.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @InjectMocks
    private TaskService taskService;

    @Mock
    private TaskRepository taskRepository;

    @Test
    public void testAll() {
        Task task1 = new Task();
        task1.setId(1L);
        Task task2 = new Task();
        task2.setId(2L);
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);

        when(taskRepository.findAll()).thenReturn(tasks);
        Flux<Task> result = taskService.all();
        StepVerifier.create(result).expectNext(task1).expectNext(task2).expectComplete().verify();
    }

/*     @Test
    public void testDashboard() {
        Task task1 = new Task();
        task1.setId(1L);
        Task task2 = new Task();
        task2.setId(2L);
        Task task3 = new Task();
        task3.setId(2L);
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);
        tasks.add(task3);

        when(taskRepository.findAll()).thenReturn(tasks);
        Flux<Task> result = taskService.dashboard();
        StepVerifier.create(result).expectNext(task1).expectNext(task2).expectNext(task3).expectComplete().verify();
    } */
}
