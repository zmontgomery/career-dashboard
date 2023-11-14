package com.senior.project.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

/**
 * Web filter for SPA applications
 * 
 * If the path does not start with API, forward to the angular frontend and use angular routing
 * instead of the spring routing
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
@Order(2)
public class AuthWebFilter implements WebFilter{

    public static final String SESSION_HEADER = "Session-ID";
    public static final String NEW_SESSION_HEADER = "New-Session";

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private AuthService authService;
 
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        Endpoints endpoint = Endpoints.toEndpoint(path);
        HttpHeaders resHeaders = exchange.getResponse().getHeaders();
        HttpHeaders reqHeaders = exchange.getRequest().getHeaders();
        
        // Ignore pre request
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) return chain.filter(exchange);

        if (endpoint.getNeedsAuthentication()) {
            try {
                String sessionId = reqHeaders.get(SESSION_HEADER).get(0);
                return authService.retrieveSession(sessionId)
                    .flatMap(session -> {
                        if (session.isExpired()) return Mono.empty();
                        return chain.filter(exchange);
                    });
            } catch (Exception e) {
                logger.error(e.getMessage());
                exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(403));
                return Mono.empty();
            }
        } else {
            return chain.filter(exchange);
        }
    }
}

