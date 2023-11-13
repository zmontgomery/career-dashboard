package com.senior.project.backend.Activity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class ActivityRouter {
    @Bean
    public RouterFunction<ServerResponse> activityRoutes(EventHandler eventHandler, MilestoneHandler milestoneHandler) {
        return route(GET("/api/events"), eventHandler::all)
                .andRoute(GET("/api/milestones"), milestoneHandler::all)
                .andRoute(GET("/api/dashboard_events"), eventHandler::dashboard);
    }
}
