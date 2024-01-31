package com.senior.project.backend.security.config;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ServerWebExchange;

import com.senior.project.backend.security.TokenGenerator;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Mono;

@Configuration
public class AuthenticationConfig {
    @Bean
    @Qualifier("authenticationManager")
    public ReactiveAuthenticationManager authenticationManager(
        ReactiveUserDetailsService userDetailsService, 
        TokenGenerator tokenGenerator
    ) {
        return (authentiction) -> {
            return Mono.just(authentiction.getPrincipal().toString())
                .map(token -> {
                    try {
                        LoggerFactory.getLogger(getClass()).info(tokenGenerator.extractEmail(token));
                        return tokenGenerator.extractEmail(token);
                    } catch (TokenVerificiationException e) {
                        return "";
                    }
                })
                .switchIfEmpty(Mono.error(new TokenVerificiationException("Email could not be extracted from token")))
                .flatMap(email -> userDetailsService.findByUsername(email))
                .switchIfEmpty(Mono.error(new EntityNotFoundException("User does not exists.")))
                .map(user -> new UsernamePasswordAuthenticationToken(user, "", user.getAuthorities()));
        };
    }

    @Bean
    public ServerSecurityContextRepository securityContextRepository(
        ReactiveAuthenticationManager authenticationManager
    ) {
        return new ServerSecurityContextRepository() {

            @Override
            public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
                return Mono.empty(); // Unused
            }

            @Override
            public Mono<SecurityContext> load(ServerWebExchange exchange) {
                return Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst("X-Authorization"))
                    .switchIfEmpty(Mono.error(new TokenVerificiationException("Request did not contain header")))
                    .filter(header -> header.startsWith("Bearer "))
                    .switchIfEmpty(Mono.error(new TokenVerificiationException("Request did not contain bearer token")))
                    .map(token -> token.split("Bearer ")[1].trim())
                    .map(token -> new UsernamePasswordAuthenticationToken(token, ""))
                    .flatMap(token -> authenticationManager.authenticate(token))
                    .map(authentication -> new SecurityContextImpl(authentication));
            }
        };
    }
}
