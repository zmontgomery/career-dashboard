package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.YearLevel;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MilestoneServiceTest {

    @InjectMocks
    private MilestoneService milestoneService;

    @Mock
    private MilestoneRepository milestoneRepository;

    @Mock
    private TaskRepository taskRepository;


    @Test
    public void testAll() {
        Milestone milestone1 = new Milestone();
        milestone1.setId(1L);
        Milestone milestone2 = new Milestone();
        milestone1.setId(2L);
        List<Milestone> milestones = new ArrayList<>();
        milestones.add(milestone1);
        milestones.add(milestone2);
        when(milestoneRepository.findAll()).thenReturn(milestones);
        Flux<Milestone> result = milestoneService.all();
        StepVerifier.create(result).expectNext(milestone1).expectNext(milestone2).expectComplete().verify();
    }

    @Test
    public void testAllWithTasks() {
        when(milestoneRepository.findAll()).thenReturn(Constants.milestoneDATA);
        Flux<Milestone> result = milestoneService.all();
        StepVerifier.create(result).expectNext(Constants.milestoneDATA.get(0)).expectNext(Constants.milestoneDATA.get(1)).expectComplete().verify();
    }

    @Test
    public void testUpdateAddTasks() {
        Milestone testM = new Milestone();
        testM.setId(6L);
        testM.setName("test milestone");
        testM.setDescription("before update");
        testM.setTasks(new ArrayList<Task>());

        String updateData = "{\"id\":6," +
            "\"tasks\":[4]," +
            "\"description\":\"adding task\"}";

        Task task4 = Constants.task4;
        long task4ID = task4.getId().longValue();

        ArrayList<Task> expectedTasks = new ArrayList<Task>();
        expectedTasks.add(task4);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(taskRepository.findById(task4ID)).thenReturn(task4);
            when(milestoneRepository.findById(testM.getId().longValue())).thenReturn(testM);
            when(milestoneRepository.save(Mockito.any(Milestone.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Milestone result = milestoneService.updateMilestone(testM.getId(), jsonMap).block();
            assertEquals(testM.getName(), result.getName());
            assertEquals("adding task", result.getDescription());
            assertEquals(expectedTasks, result.getTasks());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testDoesNotAddExistingTask() {
        Milestone testM = new Milestone();
        testM.setId(6L);
        testM.setName("test milestone");

        String updateData = "{\"id\":6," +
            "\"tasks\":[4]}";

        Task task4 = Constants.task4;
        long task4ID = task4.getId().longValue();

        ArrayList<Task> expectedTasks = new ArrayList<Task>();
        expectedTasks.add(task4);
        testM.setTasks(expectedTasks);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(taskRepository.findById(task4ID)).thenReturn(task4);
            when(milestoneRepository.findById(testM.getId().longValue())).thenReturn(testM);
            when(milestoneRepository.save(Mockito.any(Milestone.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Milestone result = milestoneService.updateMilestone(testM.getId(), jsonMap).block();
            assertEquals(testM.getName(), result.getName());
            assertEquals(expectedTasks, result.getTasks());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testRemoveTask() {
        Milestone testM = new Milestone();
        testM.setId(6L);
        testM.setName("test milestone");

        String updateData = "{\"id\":6," +
            "\"tasks\":[]}";

        Task task4 = Constants.task4;

        ArrayList<Task> expectedTasks = new ArrayList<Task>();
        expectedTasks.add(task4);
        testM.setTasks(expectedTasks);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(milestoneRepository.findById(testM.getId().longValue())).thenReturn(testM);
            when(milestoneRepository.save(Mockito.any(Milestone.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Milestone result = milestoneService.updateMilestone(testM.getId(), jsonMap).block();
            assertEquals(testM.getName(), result.getName());
            assertEquals(new ArrayList<Task>(), result.getTasks());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testTaskNotFound() {
        Milestone testM = new Milestone();
        testM.setId(6L);
        testM.setName("test milestone");
        testM.setTasks(new ArrayList<Task>());

        String updateData = "{\"id\":6," +
            "\"tasks\":[7]}";

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(milestoneRepository.findById(testM.getId().longValue())).thenReturn(testM);
            when(milestoneRepository.save(Mockito.any(Milestone.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Milestone result = milestoneService.updateMilestone(testM.getId(), jsonMap).block();
            assertEquals(testM.getName(), result.getName());
            assertEquals(new ArrayList<Task>(), result.getTasks());


        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreateMilestone() {
        Milestone testM = new Milestone();
        testM.setName("test milestone");
        testM.setYearLevel(YearLevel.Freshman);

        String updateData = "{\"name\":\"test milestone\"," +
            "\"yearLevel\":\"Freshman\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(milestoneRepository.save(Mockito.any(Milestone.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Milestone result = milestoneService.createMilestone(jsonMap).block();
            assertEquals(testM.getName(), result.getName());
            assertEquals(testM.getYearLevel(), result.getYearLevel());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
