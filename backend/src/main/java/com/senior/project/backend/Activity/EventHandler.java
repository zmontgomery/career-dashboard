package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class EventHandler {

    private final EventService eventService;

    public EventHandler(EventService eventService){
        this.eventService = eventService;
    }

    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(this.eventService.all(), Event.class );
    }
}
