package com.senior.project.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

/**
 * CORS configuration to allow request to be made while the frontend is in DEV mode
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Configuration
public class CorsConfig implements WebFluxConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
            .allowedOrigins("http://127.0.0.1:4200", "http://localhost:4200");
    }
}
