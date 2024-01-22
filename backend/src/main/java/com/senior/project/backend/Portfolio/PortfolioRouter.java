package com.senior.project.backend.Portfolio;

import com.senior.project.backend.util.URIBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class PortfolioRouter {

    private final URIBuilder builder;

    public PortfolioRouter(URIBuilder builder) {
        this.builder = builder;
    }

    @Bean
    public RouterFunction<ServerResponse> portfolioRoutes(ArtifactHandler artifactHandler) {
        String resume = builder.buildUri("portfolio", "resume");
        return route(POST(resume), artifactHandler::handleFileUpload)
                .andRoute(GET(resume + "/{artifactID}"), artifactHandler::servePdf);
    }
}
