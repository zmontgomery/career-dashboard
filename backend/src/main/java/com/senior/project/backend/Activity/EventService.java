package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.Optional;

import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) { this.eventRepository = eventRepository;}

    /**
     * Gets all events
     */
    public Flux<Event> all() {
        return Flux.fromIterable(eventRepository.findAll());
    }

    /**
     * Gets the specific events for the dashboard
     * Not implemented yet
     * A pageNum param will most likely be included in the future
     */
    public Flux<Event> dashboard() {
        return Flux.fromIterable(eventRepository.findAll()); //same as /events for now
    }

    /**
     * Updates an event using the provided map of updates
     * It assumes all updates will include id, name, location, and organizer since those are required
     * 
     * @param id event id
     * @param updates updated event data in the form of fieldName, fieldValue
     * @return the updated event or 404 if event not found
     * @throws Exception if date formatted doesn't work 
     */
    @Transactional
    public Mono<Event> updateEvent(long id, Map<String, Object> updates) {
        Optional<Event> potentiallyExistingEvent = eventRepository.findById(id);
        if (potentiallyExistingEvent.isEmpty()) {
            return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Previous Event Not found"));
        }
        Event existingEvent = potentiallyExistingEvent.get();

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");
        try {
            existingEvent.setDate((Date) simpleDateFormat.parse((String) updates.get("date")));
        }
        catch (Exception e) {
            return Mono.error(e);
        }

        existingEvent.setName((String) updates.get("name"));
        existingEvent.setLocation((String) updates.get("location"));
        existingEvent.setOrganizer((String) updates.get("organizer"));

        if (updates.containsKey("description")) {
            existingEvent.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("eventLink")) {
            existingEvent.setEventLink((String) updates.get("eventLink"));
        }
        if (updates.containsKey("buttonLabel")) {
            existingEvent.setButtonLabel((String) updates.get("buttonLabel"));
        }

        return Mono.just(eventRepository.save(existingEvent));
    }

    /**
     * Creates an event using the provided map of data
     * It assumes the data will include id, name, location, and organizer since those are required
     * 
     * @param id event id
     * @param data event data in the form of fieldName, fieldValue
     * @return the new event
     * @throws Exception if date formatted doesn't work 
     */
    @Transactional
    public Mono<Event> createEvent(Map<String, Object> data) {
        Event newEvent = new Event();

        newEvent.setName((String) data.get("name"));
        newEvent.setLocation((String) data.get("location"));
        newEvent.setOrganizer((String) data.get("organizer"));

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");
        try {
            newEvent.setDate((Date) simpleDateFormat.parse((String) data.get("date")));
        }
        catch (Exception e) {
            return Mono.error(e);
        }

        if (data.containsKey("description")) {
            newEvent.setDescription((String) data.get("description"));
        }
        if (data.containsKey("eventLink")) {
            newEvent.setEventLink((String) data.get("eventLink"));
        }
        if (data.containsKey("buttonLabel")) {
            newEvent.setButtonLabel((String) data.get("buttonLabel"));
        }

        return Mono.just(eventRepository.save(newEvent));
    }
}
