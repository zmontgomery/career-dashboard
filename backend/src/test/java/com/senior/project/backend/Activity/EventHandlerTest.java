package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@AutoConfigureWebTestClient
@SpringBootTest
public class EventHandlerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private EventService eventService;


    @Test
    public void testAll() {
        Event event1 = Event.builder().eventID("1").build();
        Event event2 = Event.builder().eventID("2").build();
        Flux<Event> eventFlux = Flux.just(event1, event2);
        when(eventService.all()).thenReturn(eventFlux);
        List<Event> result = webTestClient.get().uri("/api/events").exchange().expectStatus().isOk()
                .expectBodyList(Event.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(event1, result.get(0));
        assertEquals(event2, result.get(1));
    }

    @Test
    public void testDashboard() {
        //currently this is the same test as /events
        Event event1 = Event.builder().eventID("1").build();
        Event event2 = Event.builder().eventID("2").build();
        Event event3 = Event.builder().eventID("3").build();
        Flux<Event> eventFlux = Flux.just(event1, event2, event3);
        when(eventService.dashboard()).thenReturn(eventFlux);
        List<Event> result = webTestClient.get().uri("/api/dashboard_events?pageNum=1").exchange().expectStatus().isOk()
                .expectBodyList(Event.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(event1, result.get(0));
        assertEquals(event2, result.get(1));
        assertEquals(event3, result.get(2));
    }
}
