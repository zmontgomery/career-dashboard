package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Event;

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
public class EventHandlerTest {

    @InjectMocks
    private EventHandler eventHandler;

    @Mock
    private EventService eventService;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/api/events", eventHandler::all)
                        .GET("/api/dashboard_events", eventHandler::dashboard)
                        .POST("/api/admin/edit-event", eventHandler::update)
                        .POST("/api/admin/create-event", eventHandler::create)
                        .build())
                .build();
    }

    @Test
    public void testAll() {
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        Flux<Event> eventFlux = Flux.just(event1, event2);
        when(eventService.all()).thenReturn(eventFlux);
        List<Event> result = webTestClient.method(HttpMethod.GET)
                .uri("/api/events").exchange().expectStatus().isOk()
                .expectBodyList(Event.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(event1.getId(), result.get(0).getId());
        assertEquals(event2.getId(), result.get(1).getId());
    }

    @Test
    public void testDashboard() {
        //currently this is the same test as /events
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        Event event3 = new Event();
        event3.setId(3L);
        Flux<Event> eventFlux = Flux.just(event1, event2, event3);
        when(eventService.dashboard()).thenReturn(eventFlux);
        List<Event> result = webTestClient.method(HttpMethod.GET)
                .uri("/api/dashboard_events?pageNum=1").exchange().expectStatus().isOk()
                .expectBodyList(Event.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(event1.getId(), result.get(0).getId());
        assertEquals(event2.getId(), result.get(1).getId());
        assertEquals(event3.getId(), result.get(2).getId());
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

        Event event1 = Constants.e1;
        event1.setDescription("Explore careers!!");
        Mono<Event> eventFlux = Mono.just(event1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(eventService.updateEvent(event1.getId(), jsonMap)).thenReturn(eventFlux);
            
            Event result = webTestClient.method(HttpMethod.POST)
                    .uri("/api/admin/edit-event")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(updateData)
                    .exchange()
                    .expectStatus()
                    .isOk()
                    .expectBody(Event.class).returnResult().getResponseBody();
            assertNotNull(result);
            assertEquals(event1.getId(), result.getId());
            assertEquals(event1.getDescription(), result.getDescription());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreate() {
        String createData = "{\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"2024-04-03T04:00:00.000Z\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Explore careers\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

 
        Mono<Event> eventFlux = Mono.just(Constants.e1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(createData, new TypeReference<Map<String, Object>>() {});
            when(eventService.createEvent(jsonMap)).thenReturn(eventFlux);
            
            Event result = webTestClient.method(HttpMethod.POST)
                    .uri("/api/admin/create-event")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(createData)
                    .exchange()
                    .expectStatus()
                    .isOk()
                    .expectBody(Event.class).returnResult().getResponseBody();
            assertNotNull(result);
            assertEquals(Constants.e1.getName(), result.getName());
            assertEquals(Constants.e1.getDescription(), result.getDescription());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateFail() {
        String result = webTestClient.method(HttpMethod.POST)
                .uri("/api/admin/edit-event")
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
                .uri("/api/admin/create-event")
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
