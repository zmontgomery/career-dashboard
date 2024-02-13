package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.senior.project.backend.domain.Milestone;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class MilestoneHandler {

    private final MilestoneService milestoneService;
    private final Logger logger = LoggerFactory.getLogger(MilestoneHandler.class);

    public MilestoneHandler(MilestoneService milestoneService){
        this.milestoneService = milestoneService;
    }

    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        var taskParam = serverRequest.queryParam("tasks");
        if (taskParam.isPresent() && taskParam.get().equals("false")) {
            return ServerResponse.ok().body(this.milestoneService.all().map(Milestone::toDTO), MilestoneDTO.class );
        }

        return ServerResponse.ok().body(this.milestoneService.allWithTasks(), Milestone.class);
    }

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
}
