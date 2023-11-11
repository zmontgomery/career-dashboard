package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EventServiceTest {

    @Autowired
    private EventService eventService;

    @MockBean
    private EventRepository eventRepository;


    @Test
    public void testAll() {
        Event event1 = Event.builder().id("1").build();
        Event event2 = Event.builder().id("2").build();
        Flux<Event> eventFlux = Flux.just(event1, event2);
        List<Event> event = new ArrayList<Event>();
        event.add(event1);
        event.add(event2);


        // when(eventRepository.findByTitleContainingOrContentContaining(any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(eventFlux);
        Flux<Event> result = eventService.all();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectComplete().verify();
    }
}
