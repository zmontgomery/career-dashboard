package com.senior.project.backend.Activity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.Endpoints;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class ActivityRouter {
    @Bean
    public RouterFunction<ServerResponse> activityRoutes(EventHandler eventHandler, MilestoneHandler milestoneHandler) {
        return route(GET(Endpoints.EVENTS.getValue()), eventHandler::all)
                .andRoute(GET(Endpoints.MILSTONES.getValue()), milestoneHandler::all);
    }
}
