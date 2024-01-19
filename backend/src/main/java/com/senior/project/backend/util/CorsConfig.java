package com.senior.project.backend.util;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

import com.senior.project.backend.security.webfilters.AbstractAuthWebFilter;

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
            .exposedHeaders(AbstractAuthWebFilter.NEW_SESSION_HEADER, AbstractAuthWebFilter.TOKEN_EXPIRED_HEADER)
            .allowedOrigins("http://127.0.0.1:4200", "http://localhost:4200");
    }
}
