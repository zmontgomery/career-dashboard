package com.senior.project.backend.portfolio;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.*;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.Endpoints;

@Component
@Configuration
public class PortfolioRouter {
    @Bean
    RouterFunction<ServerResponse> portfolioRoutes(PortfolioHandler portfolioHandler) {
        return route(PUT(Endpoints.EDUCATION.uri()), portfolioHandler::saveEducation);
    }
}
