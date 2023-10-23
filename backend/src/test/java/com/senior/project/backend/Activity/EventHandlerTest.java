package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
        webTestClient.get().uri("/api/events").exchange().expectStatus().isOk().expectBody();
    }
}
