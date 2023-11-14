package com.senior.project.backend.security.webfilters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.senior.project.backend.security.AuthService;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

public abstract class AbstractAuthWebFilter implements WebFilter {
    Logger logger = LoggerFactory.getLogger(getClass());

    public static final String SESSION_HEADER = "Session-ID";
    public static final String NEW_SESSION_HEADER = "New-Session";
    public static final String REMOVE_SESSION_HEADER = "Session-Expired";

    protected AuthService authService;

    public AbstractAuthWebFilter(AuthService authService) {
        this.authService = authService;
    }

    protected abstract Mono<Void> authFilter(
        ServerWebExchange exchange, 
        WebFilterChain chain, 
        HttpHeaders resHeaders, 
        HttpHeaders reqHeaders
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Ignore pre request
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) return chain.filter(exchange);
        
        String path = exchange.getRequest().getURI().getPath();
        Endpoints endpoint = Endpoints.toEndpoint(path);
        HttpHeaders reqHeaders = exchange.getRequest().getHeaders();
        HttpHeaders resHeaders = exchange.getRequest().getHeaders();

        if (endpoint.getNeedsAuthentication()) {
            try {
                return authFilter(exchange, chain, reqHeaders, resHeaders);
            } catch (Exception e) {
                logger.error(e.getMessage());
                exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(401));
                return Mono.empty();
            }
        } else {
            return chain.filter(exchange);
        }
    }
}
