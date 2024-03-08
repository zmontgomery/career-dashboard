package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Task;

import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskHandlerTest {

    @InjectMocks
    private TaskHandler taskHandler;

    @Mock
    private TaskService taskService;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/api/tasks", taskHandler::all)
                        //.GET("/api/dashboard_tasks", taskHandler::dashboard)
                        .POST("/edit", taskHandler::update)
                        .POST("/create", taskHandler::create)
                        .GET("/test/{id}", taskHandler::getById)
                        .build())
                .build();
    }

    @Test
    public void testAll() {
        Task task1 = new Task();
        task1.setId(1L);
        Task task2 = new Task();
        task2.setId(2L);
        Flux<Task> taskFlux = Flux.just(task1, task2);
        when(taskService.all()).thenReturn(taskFlux);
        List<Task> result = webTestClient.method(HttpMethod.GET)
                .uri("/api/tasks").exchange().expectStatus().isOk()
                .expectBodyList(Task.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(task1.getId(), result.get(0).getId());
        assertEquals(task2.getId(), result.get(1).getId());
    }

    /* @Test
    public void testDashboard() {
        //currently this is the same test as /tasks
        Task task1 = new Task();
        task1.setId(1L);
        Task task2 = new Task();
        task2.setId(2L);
        Task task3 = new Task();
        task3.setId(3L);
        Flux<Task> taskFlux = Flux.just(task1, task2, task3);
        when(taskService.dashboard()).thenReturn(taskFlux);
        List<Task> result = webTestClient.method(HttpMethod.GET)
                .uri("/api/dashboard_tasks?pageNum=1").exchange().expectStatus().isOk()
                .expectBodyList(Task.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(task1.getId(), result.get(0).getId());
        assertEquals(task2.getId(), result.get(1).getId());
        assertEquals(task3.getId(), result.get(2).getId());
    } */

    @Test
    public void testUpdate() {
        String updateData = "{\"id\":1," +
        "\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"2024-04-03T04:00:00.000Z\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Explore careers!!\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

        Task task1 = Constants.task1;
        task1.setDescription("Explore careers!!");
        Mono<Task> taskFlux = Mono.just(task1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(taskService.updateTask(task1.getId(), jsonMap)).thenReturn(taskFlux);
            
            Task result = webTestClient.method(HttpMethod.POST)
                    .uri("/edit")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(updateData)
                    .exchange()
                    .expectStatus()
                    .isOk()
                    .expectBody(Task.class).returnResult().getResponseBody();
            assertNotNull(result);
            assertEquals(task1.getId(), result.getId());
            assertEquals(task1.getDescription(), result.getDescription());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreate() {
        String updateData = "{\"id\":1," +
        "\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"2024-04-03T04:00:00.000Z\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Explore careers!!\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

        Mono<Task> taskFlux = Mono.just(Constants.task1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(taskService.createTask(jsonMap)).thenReturn(taskFlux);
            
            Task result = webTestClient.method(HttpMethod.POST)
                    .uri("/create")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(updateData)
                    .exchange()
                    .expectStatus()
                    .isOk()
                    .expectBody(Task.class).returnResult().getResponseBody();
            assertNotNull(result);
            assertEquals(Constants.task1.getDescription(), result.getDescription());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateFail() {
        String result = webTestClient.method(HttpMethod.POST)
                .uri("/edit")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue("hewwo")
                .exchange()
                .expectStatus()
                .isBadRequest()
                .expectBody(String.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(result, "Invalid JSON format");
    }

    @Test
    public void testCreateFail() {
        String result = webTestClient.method(HttpMethod.POST)
                .uri("/create")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue("hewwo")
                .exchange()
                .expectStatus()
                .isBadRequest()
                .expectBody(String.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(result, "Invalid JSON format");
    }

    @Test
    public void testGetByID() {
        Task task1 = Constants.task1;
        Mono<Task> taskFlux = Mono.just(task1);

        when(taskService.findById(1)).thenReturn(taskFlux);
        
        Task result = webTestClient.method(HttpMethod.GET)
                .uri("/test/1")
                .exchange()
                .expectStatus()
                .isOk()
                .expectBody(Task.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(task1.getId(), result.getId());
        assertEquals(task1.getDescription(), result.getDescription());
    }

}
