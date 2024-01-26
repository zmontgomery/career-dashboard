package com.senior.project.backend.Portfolio;

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

//        String resume = builder.buildUri("portfolio", "resume");
//        String portfolio = builder.buildUri("portfolio");
//        String artifactList = builder.buildUri("portfolio", "artifacts");
//        String singleArtifact = builder.buildUri("portfolio" + "/{artifactID}");
        // TODO do something special here if coming from resume url
        return route(POST(Endpoints.RESUME.uri(), artifactHandler::handleFileUpload)
                .andRoute(POST(portfolio), artifactHandler::handleFileUpload)
                .andRoute(GET(artifactList), artifactHandler::all)
                .andRoute(GET(singleArtifact), artifactHandler::servePdf);
    }
}
