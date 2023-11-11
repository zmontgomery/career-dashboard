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
        Event event1 = Event.builder().id("1").build();
        Event event2 = Event.builder().id("2").build();
        Flux<Event> eventFlux = Flux.just(event1, event2);
        when(eventService.all()).thenReturn(eventFlux);
        List<Event> result = webTestClient.get().uri("/api/events").exchange().expectStatus().isOk()
                .expectBodyList(Event.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(event1, result.get(0));
        assertEquals(event2, result.get(1));
    }
}
