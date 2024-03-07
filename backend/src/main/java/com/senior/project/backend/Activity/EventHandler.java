package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.domain.Event;

import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class EventHandler {

    private final EventService eventService;

    public EventHandler(EventService eventService){
        this.eventService = eventService;
    }

    /**
     * Retrieves all events
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(this.eventService.all(), Event.class );
    }

    /**
     * Retrieves the selection of events displayed on the dashboard, paginated
     * Not implemented completely yet, so this functions the same as /events
     */
    public Mono<ServerResponse> dashboard(ServerRequest serverRequest) {
        serverRequest.queryParam("pageNum");    // TODO pass to dashboard() and get paged result
        return ServerResponse.ok().body(this.eventService.dashboard(), Event.class );
    }

    /**
     * Updates an existing event
     *
     * @return 200 if successful or 400 bad request when the update data is not properly formatted
     */
    public Mono<ServerResponse> update(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(String.class)
        .flatMap(json -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});

                long eventID = ((Number) jsonMap.get("id")).longValue();

                return ServerResponse.ok().body(eventService.updateEvent(eventID, jsonMap), Event.class);
            } catch (JsonProcessingException e) {
                return ServerResponse.badRequest().bodyValue("Invalid JSON format");
            }
        });
    } 

    /**
     * Create new event
     *
     * @return 200 if successful or 400 bad request when the update data is not properly formatted
     */
    public Mono<ServerResponse> create(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(String.class)
        .flatMap(json -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});

                return ServerResponse.ok().body(eventService.createEvent(jsonMap), Event.class);
            } catch (JsonProcessingException e) {
                return ServerResponse.badRequest().bodyValue("Invalid JSON format");
            }
        });
    } 
}
