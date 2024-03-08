package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.domain.Task;

import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class TaskHandler {

    private final TaskService taskService;

    public TaskHandler(TaskService taskService){
        this.taskService = taskService;
    }

    /**
     * Retrieves all tasks
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(this.taskService.all(), Task.class );
    }

    /**
     * Updates an existing task
     *
     * @return 200 if successful or 400 bad request when the update data is not properly formatted
     */
    public Mono<ServerResponse> update(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(String.class)
        .flatMap(json -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});

                long taskID = ((Number) jsonMap.get("id")).longValue();

                return ServerResponse.ok().body(taskService.updateTask(taskID, jsonMap), Task.class);
            } catch (JsonProcessingException e) {
                return ServerResponse.badRequest().bodyValue("Invalid JSON format");
            }
        });
    } 

    /**
     * Retrieve task object using an ID
     * Used when assigning tasks to milestones
     *
     * @return task object
     */
    public Mono<ServerResponse> getById(ServerRequest serverRequest) {
        return Mono.just(serverRequest.pathVariable("id"))
            .map(id -> Integer.parseInt(id))
            .flatMap(id -> taskService.findById(id))
            .flatMap(task -> ServerResponse.ok().bodyValue(task));
    }
    
    /**
     * Create new task
     *
     * @return 200 if successful or 400 bad request when the update data is not properly formatted
     */
    public Mono<ServerResponse> create(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(String.class)
        .flatMap(json -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});

                return ServerResponse.ok().body(taskService.createTask(jsonMap), Task.class);
            } catch (JsonProcessingException e) {
                return ServerResponse.badRequest().bodyValue("Invalid JSON format");
            }
        });
    } 
}
