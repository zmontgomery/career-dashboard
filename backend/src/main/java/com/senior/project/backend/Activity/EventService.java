package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) { this.eventRepository = eventRepository;}
    public Flux<Event> all() {
        return eventRepository.all();
    }
}
