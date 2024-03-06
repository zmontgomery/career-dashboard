package com.senior.project.backend.Activity;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Task;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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

    @Test
    public void testGetByID() {
        Task task1 = Constants.task1;
        int taskID = task1.getId().intValue();

        when(taskRepository.findById(task1.getId().longValue())).thenReturn(task1);
        Task result = taskService.findById(taskID).block();
        assertEquals(result.getId(), task1.getId());
        assertEquals(result.getName(), task1.getName());
    }

    @Test
    public void testGetByIDNull() {
        Task task1 = Constants.task1;
        int taskID = task1.getId().intValue();
        Mono<Task> expected = Mono.empty();

        when(taskRepository.findById(task1.getId().longValue())).thenReturn(null);
        Mono<Task> result = taskService.findById(taskID);
        assertEquals(result.block(), expected.block());
    }

    @Test
    public void testUpdateMinimum() {
        String updateData = "{\"id\":1," +
        "\"taskType\":\"artifact\"," +
        "\"artifactName\":\"Meeting Notes!\"," +
        "\"isRequired\":\"true\"}";

        Task task1 = Constants.task1;
        task1.setArtifactName("Meeting Notes!");
        long taskID = task1.getId().longValue();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(taskRepository.findById(taskID)).thenReturn(Constants.task1);
            when(taskRepository.save(Mockito.any(Task.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.updateTask(taskID, jsonMap).block();
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals(task1.getArtifactName(), result.getArtifactName());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
