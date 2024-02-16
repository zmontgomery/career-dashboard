package com.senior.project.backend.Portfolio;

import com.senior.project.backend.artifact.ArtifactHandler;
import com.senior.project.backend.util.Endpoints;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class PortfolioRouter {

    public PortfolioRouter() {}

    @Bean
    public RouterFunction<ServerResponse> portfolioRoutes(ArtifactHandler artifactHandler) {
        // TODO do something special here if coming from resume url
        return route(POST(Endpoints.RESUME.uri()), artifactHandler::handleFileUpload)
                .andRoute(POST(Endpoints.PORTFOLIO.uri()), artifactHandler::handleFileUpload)
                .andRoute(GET(Endpoints.ARTIFACT_LIST.uri()), artifactHandler::all)
                .andRoute(GET(Endpoints.SINGLE_ARTIFACT.uri()), artifactHandler::servePdf);
    }
}
