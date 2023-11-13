package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Event;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class EventRepository {

    public static final List<Event> DATA = new ArrayList<>();
    public static final List<Event> DASH_DATA = new ArrayList<>();

    static {
        Event e1 = Event.builder().eventID("event 1")
                .name("Event 1")
                .isRecurring(false)
                .organizer("Organizer 1")
                .location("Location 1")
                .isRequired(true).build();
        e1.setDescription("Event 1 description");
        e1.setDate(new Date());
        DATA.add(e1);
        DASH_DATA.add(e1);
        Event e2 = Event.builder().eventID("event 2")
                .name("Event 2")
                .isRecurring(false)
                .organizer("Organizer 2")
                .location("Location 2")
                .isRequired(false).build();
        e2.setDescription("Event 2 description");
        e2.setDate(new Date());
        DATA.add(e2);
        DASH_DATA.add(e2);
        Event e3 = Event.builder().eventID("event 3")
                .name("Event 3")
                .isRecurring(false)
                .organizer("Organizer 3")
                .location("Location 3")
                .isRequired(false).build();
        e3.setDescription("Event 3 description");
        e3.setDate(new Date());
        DASH_DATA.add(e3);
    }

    public Flux<Event> all() {
        return Flux.fromIterable(DATA);
    }

    public Flux<Event> dashboard() {
        //PLACEHOLDER for now the dashboard_events call acts the same as the events call
        return Flux.fromIterable(DASH_DATA);
    }
}
