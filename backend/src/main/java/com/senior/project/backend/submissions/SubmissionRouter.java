package com.senior.project.backend.submissions;

import static org.springframework.web.reactive.function.server.RequestPredicates.DELETE;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.artifact.ArtifactHandler;
import com.senior.project.backend.util.Endpoints;

@Component
public class SubmissionRouter {
    @Bean
    public RouterFunction<ServerResponse> submissionRoutes(
        SubmissionHandler submissionHandler,
        ArtifactHandler artifactHandler    
    ) {
        return route(POST(Endpoints.SUBMISSION_ARTIFACT.uri()), artifactHandler::handleFileUpload)
            .andRoute(DELETE(Endpoints.SUBMISSION_ARTIFACT_DELETE.uri()), artifactHandler::handleFileDelete);
    }
}
