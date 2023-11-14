package com.senior.project.backend.security.webfilters;

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

import com.senior.project.backend.security.AuthService;
import reactor.core.publisher.Mono;

@Component
@Order(3)
public class AuthRefreshWebFilter implements WebFilter {

    Logger logger = LoggerFactory.getLogger(getClass());

    public static final String SESSION_HEADER = "Session-ID";
    public static final String NEW_SESSION_HEADER = "New-Session";

    @Autowired
    private AuthService authService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) return chain.filter(exchange);
        HttpHeaders resHeaders = exchange.getResponse().getHeaders();
        HttpHeaders reqHeaders = exchange.getRequest().getHeaders();

        try {
            String sessionId = reqHeaders.get(SESSION_HEADER).get(0);
            authService.retrieveSession(sessionId).subscribe(s -> {
                if (s.isInRefreshRange()) {
                    authService.deleteSession(sessionId)
                        .flatMap(os -> authService.createSession(os.getUser()))
                        .subscribe(ns -> {
                            resHeaders.add(NEW_SESSION_HEADER, ns.getSessionID().toString());
                        });
                }
            });
            return chain.filter(exchange);
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(403));
            return Mono.empty();
        }
    }
    
}
