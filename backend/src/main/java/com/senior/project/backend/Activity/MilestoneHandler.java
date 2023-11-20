package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
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
}
