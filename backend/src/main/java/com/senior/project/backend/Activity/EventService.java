package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) { this.eventRepository = eventRepository;}
    public Flux<Event> all() {
        return Flux.fromIterable(eventRepository.findAll());
    }
    public Flux<Event> dashboard() {
        return Flux.fromIterable(eventRepository.dashboard());
    }
}
