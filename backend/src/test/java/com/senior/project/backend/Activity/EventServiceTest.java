package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Event;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import java.util.*;
import java.text.SimpleDateFormat;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @InjectMocks
    private EventService eventService;

    @Mock
    private EventRepository eventRepository;

    @Test
    public void testAll() {
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        List<Event> events = new ArrayList<>();
        events.add(event1);
        events.add(event2);

        when(eventRepository.findAll()).thenReturn(events);
        Flux<Event> result = eventService.all();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectComplete().verify();
    }

    @Test
    public void testDashboard() {
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        Event event3 = new Event();
        event3.setId(2L);
        List<Event> events = new ArrayList<>();
        events.add(event1);
        events.add(event2);
        events.add(event3);

        when(eventRepository.findAll()).thenReturn(events);
        Flux<Event> result = eventService.dashboard();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectNext(event3).expectComplete().verify();
    }

    @Test
    public void testUpdate() {
        String updateData = "{\"id\":1," +
        "\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"2024-04-03T04:00:00.000Z\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Explore careers!!\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

        Event event1 = Constants.e1;
        event1.setDescription("Explore careers!!");
        Optional<Event> eventOption = Optional.of(event1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(eventRepository.findById(event1.getId())).thenReturn(eventOption);
            when(eventRepository.save(Mockito.any(Event.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Event result = eventService.updateEvent(event1.getId(), jsonMap).block();
            assertEquals(event1.getDescription(), result.getDescription());
            assertEquals(event1.getDate(), result.getDate());
            assertEquals(event1.getLocation(), result.getLocation());
            assertEquals(event1.getOrganizer(), result.getOrganizer());
            assertEquals(event1.getButtonLabel(), result.getButtonLabel());
            assertEquals(event1.getEventLink(), result.getEventLink());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateMinimum() {
        String updateData = "{\"id\":1," +
        "\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"2024-04-03T04:00:00.000Z\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":\"true\"}";

        Event event1 = Constants.e1;
        event1.setDescription("Explore careers!!");
        Optional<Event> eventOption = Optional.of(event1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(eventRepository.findById(event1.getId())).thenReturn(eventOption);
            when(eventRepository.save(Mockito.any(Event.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Event result = eventService.updateEvent(event1.getId(), jsonMap).block();
            assertEquals(event1.getDate(), result.getDate());
            assertEquals(event1.getLocation(), result.getLocation());
            assertEquals(event1.getOrganizer(), result.getOrganizer());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateNoEvent() {
        String updateData = "{\"id\":1," +
        "\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"2024-04-03T04:00:00.000Z\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":\"true\"}";

        Event event1 = Constants.e1;

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});

            Mono<Event> result = eventService.updateEvent(event1.getId(), jsonMap);
            StepVerifier.create(result).expectError();
            

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreate() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");
        String date = simpleDateFormat.format(Constants.e1.getDate());

        String updateData = "{\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"" + date + "\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Explore careers!!\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

        Event event1 = Constants.e1;
        event1.setDescription("Explore careers!!");

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(eventRepository.save(Mockito.any(Event.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Event result = eventService.createEvent(jsonMap).block();
            assertEquals(event1.getDescription(), result.getDescription());
            assertEquals(event1.getDate().toString(), result.getDate().toString());
            assertEquals(event1.getLocation(), result.getLocation());
            assertEquals(event1.getOrganizer(), result.getOrganizer());
            assertEquals(event1.getButtonLabel(), result.getButtonLabel());
            assertEquals(event1.getEventLink(), result.getEventLink());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
    
    @Test
    public void testCreateMinimum() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");
        String date = simpleDateFormat.format(Constants.e1.getDate());

        String updateData = "{\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"" + date + "\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":\"true\"}";

        Event event1 = Constants.e1;
        event1.setDescription("Explore careers!!");

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(eventRepository.save(Mockito.any(Event.class)))
                .thenAnswer(i -> i.getArguments()[0]);

            Event result = eventService.createEvent(jsonMap).block();
            assertEquals(event1.getDate().toString(), result.getDate().toString());
            assertEquals(event1.getLocation(), result.getLocation());
            assertEquals(event1.getOrganizer(), result.getOrganizer());

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateBadDate() {
        String updateData = "{\"id\":1," +
        "\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"wow\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Explore careers!!\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

        Event event1 = Constants.e1;
        Optional<Event> eventOption = Optional.of(event1);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});
            when(eventRepository.findById(event1.getId())).thenReturn(eventOption);

            assertThrows(Exception.class, () -> {
                eventService.updateEvent(event1.getId(), jsonMap).block();
            });

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreateBadDate() {
        String updateData = "{\"name\":\"Major/Minor & Career Exploration Event\"," +
        "\"date\":\"wow\"," +
        "\"location\":\"Field House\"," +
        "\"organizer\":\"SUNY Oswego\"," +
        "\"isRecurring\":true," +
        "\"description\":\"Event 1 description\"," +
        "\"eventLink\":\"Test Link\"," +
        "\"buttonLabel\":\"More Info\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<Map<String, Object>>() {});

            assertThrows(Exception.class, () -> {
                eventService.createEvent(jsonMap).block();
            });

        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

}
