package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Event;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class EventRepository {

    private static final List<Event> DATA = new ArrayList<>();

    static {
        DATA.add(Event.builder().eventID("event 1")
                .activityID("activity 1")
                .isRecurring(false)
                .organizer("Organizer 1")
                .location("Location 1")
                .isRequired(true).build());
        DATA.add(Event.builder().eventID("event 2")
                .activityID("activity 2")
                .isRecurring(false)
                .organizer("Organizer 2")
                .location("Location 2")
                .isRequired(false).build());
    }

//    Flux<Post> findAll() {
//        return Flux.fromIterable(DATA);
//    }

    public Flux<Event> all() {
        return Flux.fromIterable(DATA);
    }
}
