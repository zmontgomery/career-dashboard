package com.senior.project.backend.security.webfilters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.senior.project.backend.security.AuthService;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

/**
 * Abstract class for authentication web filters which only run if
 * the endpoint requested is a protected resource
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public abstract class AbstractAuthWebFilter implements WebFilter {
    Logger logger = LoggerFactory.getLogger(getClass());

    public static final String AUTHORIZATION_HEADER = "X-Authorization";
    public static final String NEW_SESSION_HEADER = "New-Session";
    public static final String REMOVE_SESSION_HEADER = "Session-Expired";

    protected AuthService authService;

    public AbstractAuthWebFilter(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Code that runs the authentication filter
     * 
     * @param exchange - The web exchange
     * @param chain - The filter chain
     * @return
     * @throws TokenVerificiationException 
     */
    protected abstract Mono<Void> authFilter(
        ServerWebExchange exchange, 
        WebFilterChain chain
    ) throws TokenVerificiationException;

    /**
     * Filters incoming http requests
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Ignore pre request
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) return chain.filter(exchange);

        String path = exchange.getRequest().getURI().getPath();
        Endpoints endpoint = Endpoints.toEndpoint(path);

        // Execute filter if the endpoint needs authentication
        if (endpoint.getNeedsAuthentication()) {
            try {
                return authFilter(exchange, chain);
            } catch (Exception e) {
                // Print error and set response status code to unauthorized
                logger.error(e.getMessage());
                exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(401));
                return Mono.empty();
            }
        } else {
            return chain.filter(exchange);
        }
    }
}
