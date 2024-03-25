package com.senior.project.backend.Activity;

import com.senior.project.backend.artifact.NonBlockingExecutor;
import com.senior.project.backend.domain.Event;

import java.text.ParseException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;

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
        return NonBlockingExecutor.executeMany(eventRepository::findAll);
    }

    /**
     * Gets the specific events for the dashboard
     * TODO implement this
     * A pageNum param will most likely be included in the future
     */
    public Flux<Event> dashboard() {
        return NonBlockingExecutor.executeMany(eventRepository::findAll); //same as /events for now
    }

    /**
     * Updates an event using the provided map of updates
     * It assumes all updates will include id, name, location, and organizer since those are required
     * 
     * @param id event id
     * @param updates updated event data in the form of fieldName, fieldValue
     * @return the updated event or 404 if event not found or Mono error if date formatted doesn't work
     */
    @Transactional
    public Mono<Event> updateEvent(long id, Map<String, Object> updates) {
        return NonBlockingExecutor.execute(()-> eventRepository.findById(id))
                .flatMap(potentiallyExistingEvent -> potentiallyExistingEvent.<Mono<? extends Event>>map(Mono::just)
                        .orElseGet(() -> Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Previous Event Not found"))))
                .flatMap(existingEvent -> {
                    try {
                        updateEvent(updates, existingEvent);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }

                    return NonBlockingExecutor.execute(()->eventRepository.save(existingEvent));
                });
    }

    /**
     * Creates an event using the provided map of data
     * It assumes the data will include id, name, location, and organizer since those are required
     * 
     * @param data event data in the form of fieldName, fieldValue
     * @return the new event or Mono error if date formatted doesn't work
     */
    @Transactional
    public Mono<Event> createEvent(Map<String, Object> data) {
        Event newEvent = new Event();

        try {
            updateEvent(data, newEvent);
        } catch (Exception e) {
            return Mono.error(e);
        }

        return NonBlockingExecutor.execute(()->eventRepository.save(newEvent));
    }

    /**
     *
     * @param data data to updateEvent with
     * @param newEvent Event object to be updated
     * @throws ParseException if date formatted doesn't work
     */
    private void updateEvent(Map<String, Object> data, Event newEvent) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");

        newEvent.setDate(simpleDateFormat.parse((String) data.get("date")));

        newEvent.setName((String) data.get("name"));
        newEvent.setLocation((String) data.get("location"));
        newEvent.setOrganizer((String) data.get("organizer"));

        if (data.containsKey("description")) {
            newEvent.setDescription((String) data.get("description"));
        }
        if (data.containsKey("eventLink")) {
            newEvent.setEventLink((String) data.get("eventLink"));
        }
        if (data.containsKey("buttonLabel")) {
            newEvent.setButtonLabel((String) data.get("buttonLabel"));
        }
    }
}
