package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
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
}
