package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Flux;
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
}
