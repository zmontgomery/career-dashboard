package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class MilestoneHandler {

    private final MilestoneService milestoneService;

    public MilestoneHandler(MilestoneService milestoneService){
        this.milestoneService = milestoneService;
    }

    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(this.milestoneService.all(), Event.class );
    }
}
