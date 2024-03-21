package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.senior.project.backend.domain.Milestone;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Component
public class MilestoneHandler {

    private final MilestoneService milestoneService;

    public MilestoneHandler(MilestoneService milestoneService){
        this.milestoneService = milestoneService;
    }

    /**
     * Retrieves all milestones
     * 
     * @param serverRequest containing query param for whether or not to include the milestone's tasks
     * @return the list of milestones, with or without tasks
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        var taskParam = serverRequest.queryParam("tasks");
        if (taskParam.isPresent() && taskParam.get().equals("false")) {
            return ServerResponse.ok().body(this.milestoneService.all().map(Milestone::toDTO), MilestoneDTO.class );
        }

        return ServerResponse.ok().body(this.milestoneService.allWithTasks(), Milestone.class);
    }

    /**
     * Updates an existing milestone
     *
     * @return 200 if successful or 400 bad request when the update data is not properly formatted
     */
    public Mono<ServerResponse> update(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(String.class)
        .flatMap(json -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});

                long milestoneID = ((Number) jsonMap.get("id")).longValue();

                return ServerResponse.ok().body(milestoneService.updateMilestone(milestoneID, jsonMap), Milestone.class);
            } catch (JsonProcessingException e) {
                return ServerResponse.badRequest().bodyValue("Invalid JSON format");
            }
        });
    }

    /**
     * Create new milestone
     *
     * @return 200 if successful or 400 bad request when the update data is not properly formatted
     */
    public Mono<ServerResponse> create(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(String.class)
        .flatMap(json -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});

                return ServerResponse.ok().body(milestoneService.createMilestone(jsonMap), Milestone.class);
            } catch (JsonProcessingException e) {
                return ServerResponse.badRequest().bodyValue("Invalid JSON format");
            }
        });
    }

    /**
     * Get Completed Milestones by the user.
     * @param serverRequest HttpRequest from frontend. Requires query param with userId
     * @return ServerResponse containing the Completed Milestones
     */
    public Mono<ServerResponse> completed(ServerRequest serverRequest) {
        var userParam = serverRequest.queryParam("userId");
        try {
            if (userParam.isPresent()) {
                var userid = UUID.fromString(userParam.get());
                return ServerResponse.ok().body(this.milestoneService.completedMilestones(userid).map(Milestone::toDTO), MilestoneDTO.class);
            }
        } catch (IllegalArgumentException e) {
            return ServerResponse.badRequest().bodyValue("Invalid UserId");
        }

        return ServerResponse.badRequest().bodyValue("No userId param provided");
    }
}
