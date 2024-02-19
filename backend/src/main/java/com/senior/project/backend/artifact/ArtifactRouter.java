package com.senior.project.backend.artifact;

import static org.springframework.web.reactive.function.server.RequestPredicates.DELETE;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.Endpoints;

@Component
public class ArtifactRouter {
    @Bean
    public RouterFunction<ServerResponse> artifactRoutes(ArtifactHandler artifactHandler) {
        return route(POST(Endpoints.ARTIFACT.uri()), artifactHandler::handleFileUpload)
            .andRoute(GET(Endpoints.ARTIFACT.uri()), artifactHandler::all)
            .andRoute(DELETE(Endpoints.ARTIFACT_ID.uri()), artifactHandler::handleFileDelete)
            .andRoute(GET(Endpoints.ARTIFACT_FILE.uri()), artifactHandler::servePdf);
    }
}
