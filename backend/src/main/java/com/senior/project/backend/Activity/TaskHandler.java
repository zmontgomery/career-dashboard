package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Task;
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

    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(this.taskService.all(), Task.class );
    }

/*     public Mono<ServerResponse> dashboard(ServerRequest serverRequest) {
        serverRequest.queryParam("pageNum");
        return ServerResponse.ok().body(this.taskService.dashboard(), Task.class );
    } */
}
