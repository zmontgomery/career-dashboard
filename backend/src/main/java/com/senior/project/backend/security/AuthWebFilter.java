package com.senior.project.backend.security;

import java.util.LinkedList;
import java.util.List;

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

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private AuthRepository authRepository;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        Endpoints endpoint = Endpoints.toEndpoint(path);
        
        // Ignore pre request
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) return chain.filter(exchange);

        if (endpoint.getNeedsAuthentication()) {
            try {
                HttpHeaders headers = exchange.getRequest().getHeaders();
                String sessionId = headers.get("SessionID").get(0);
                logger.info(sessionId);
                return authRepository.findSessionBySessionID(sessionId)
                    .flatMap(session -> {
                        logger.info(session.toString());
                        if (session != null) {
                            boolean valid = true;

                            if (session.isExpired()) {
                                valid = false;
                                authRepository.deleteSession(session);
                            }

                            return valid ? chain.filter(exchange) : Mono.empty();
                        }
                        return Mono.empty();
                    });
            } catch (Exception e) {
                exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(403));
                return Mono.empty();
            }
        } else {
            return chain.filter(exchange);
        }
    }
}

