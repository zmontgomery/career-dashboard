package com.senior.project.backend.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

import java.util.Arrays;

/**
 * Security configuration for Spring Security
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Autowired
    private ReactiveAuthenticationManager authenticationManager;

    @Autowired
    private ServerSecurityContextRepository securityContextRepostory;

    /**
     * Configuration for the filter chain, where the custom authentication manager
     * and security contex† repository are set
     */
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http.csrf(c -> c.disable());
        http.cors(c -> c.configurationSource(corsConfigurationSource()));
        http.authorizeExchange(e -> {
            e.pathMatchers(Endpoints.getOpenRoutes()).permitAll();
            e.pathMatchers("/api/**").authenticated();
            e.anyExchange().permitAll();
        });
        http.authenticationManager(authenticationManager);
        http.securityContextRepository(securityContextRepostory);
        http.exceptionHandling(eh -> {
            eh.authenticationEntryPoint((swe, exception) -> {
                if (exception != null) swe.getResponse().setStatusCode(HttpStatusCode.valueOf(401));
                return Mono.empty();
            });
            eh.accessDeniedHandler((swe, exception) -> {
                if (exception != null) swe.getResponse().setStatusCode(HttpStatusCode.valueOf(403));
                return Mono.empty();
            });
        });

        return http.build();
    }

    /**
     * The configuration for the CORS filter
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList(HttpHeaders.SET_COOKIE));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
