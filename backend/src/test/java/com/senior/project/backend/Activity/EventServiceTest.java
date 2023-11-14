package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EventServiceTest {

    @Autowired
    private EventService eventService;

    @MockBean
    private EventRepository eventRepository;


    @Test
    public void testAll() {
        Event event1 = Event.builder().eventID("1").build();
        Event event2 = Event.builder().eventID("2").build();
        Flux<Event> eventFlux = Flux.just(event1, event2);
        when(eventRepository.all()).thenReturn(eventFlux);
        Flux<Event> result = eventService.all();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectComplete().verify();
    }

    @Test
    public void testDashboard() {
        Event event1 = Event.builder().eventID("1").build();
        Event event2 = Event.builder().eventID("2").build();
        Event event3 = Event.builder().eventID("3").build();
        Flux<Event> eventFlux = Flux.just(event1, event2, event3);
        when(eventRepository.dashboard()).thenReturn(eventFlux);
        Flux<Event> result = eventService.dashboard();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectNext(event3).expectComplete().verify();
    }
}
