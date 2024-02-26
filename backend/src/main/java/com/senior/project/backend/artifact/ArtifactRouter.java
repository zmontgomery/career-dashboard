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

/**
 * Endpoints for artifacts
 */
@Component
public class ArtifactRouter {
    @Bean
    public RouterFunction<ServerResponse> artifactRoutes(ArtifactHandler artifactHandler) {
        return route(POST(Endpoints.ARTIFACT.uri()), artifactHandler::handleFileUpload)
            .andRoute(POST(Endpoints.UPLOAD_IMAGE_EVENT.uri()), artifactHandler::handleEventImageUpload)
            .andRoute(POST(Endpoints.USERS_PROFILE_PICTURE.uri()), artifactHandler::handleProfileImageUpload)
            .andRoute(DELETE(Endpoints.ARTIFACT_ID.uri()), artifactHandler::handleFileDelete)
            .andRoute(GET(Endpoints.ARTIFACT_FILE.uri()), artifactHandler::servePdf)
            .andRoute(GET(Endpoints.IMAGE_EVENT.uri()), artifactHandler::serveImage);
    }
}
