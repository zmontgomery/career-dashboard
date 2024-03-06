package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Milestone;

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
public class MilestoneHandlerTest {

    private WebTestClient webTestClient;

    @InjectMocks
    private MilestoneHandler milestoneHandler;

    @Mock
    private MilestoneService milestoneService;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/test", milestoneHandler::all)
                        .POST("/edit", milestoneHandler::update)
                        .POST("/create", milestoneHandler::create)
                        .build())
                .build();
    }

    @Test
    public void testAllWithTasks() {
        Flux<Milestone> eventFlux = Flux.just(Constants.m1, Constants.m2);
        when(milestoneService.allWithTasks()).thenReturn(eventFlux);
        List<Milestone> result = webTestClient.get().uri("/test").exchange().expectStatus().isOk()
                .expectBodyList(Milestone.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(Constants.m1.getId(), result.get(0).getId());
        assertEquals(Constants.m2.getId(), result.get(1).getId());
    }

    @Test
    public void testAll() {
        Flux<Milestone> eventFlux = Flux.just(Constants.m1, Constants.m2);
        when(milestoneService.all()).thenReturn(eventFlux);
        List<Milestone> result = webTestClient.get().uri("/test?tasks=false").exchange().expectStatus().isOk()
                .expectBodyList(Milestone.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(Constants.m1.getId(), result.get(0).getId());
        assertEquals(Constants.m2.getId(), result.get(1).getId());
    }

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

        Milestone milestone1 = Constants.m1;
        milestone1.setDescription("Explore careers!!");
        Mono<Milestone> milestoneFlux = Mono.just(milestone1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(milestoneService.updateMilestone(milestone1.getId(), jsonMap)).thenReturn(milestoneFlux);
            
            Milestone result = webTestClient.method(HttpMethod.POST)
                    .uri("/edit")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(updateData)
                    .exchange()
                    .expectStatus()
                    .isOk()
                    .expectBody(Milestone.class).returnResult().getResponseBody();
            assertNotNull(result);
            assertEquals(milestone1.getId(), result.getId());
            assertEquals(milestone1.getDescription(), result.getDescription());

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

        Mono<Milestone> milestoneFlux = Mono.just(Constants.m1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(milestoneService.createMilestone(jsonMap)).thenReturn(milestoneFlux);
            
            Milestone result = webTestClient.method(HttpMethod.POST)
                    .uri("/create")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(updateData)
                    .exchange()
                    .expectStatus()
                    .isOk()
                    .expectBody(Milestone.class).returnResult().getResponseBody();
            assertNotNull(result);
            assertEquals(Constants.m1.getDescription(), result.getDescription());

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
}
