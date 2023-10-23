package com.senior.project.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TokenType;
import com.senior.project.backend.security.verifiers.MicrosoftEntraIDTokenVerifier;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.security.verifiers.TokenVerifier;

import reactor.core.observability.SignalListener;
import reactor.core.publisher.Mono;

@Component
public class AuthHandler {

    private final Logger logger = LoggerFactory.getLogger(AuthHandler.class);

    private final AuthRepository repository;
    private final MicrosoftEntraIDTokenVerifier microsoftEntraIDTokenVerifier;

    public AuthHandler(
        AuthRepository repository,
        MicrosoftEntraIDTokenVerifier microsoftEntraIDTokenVerifier
    ) {
        this.repository = repository;
        this.microsoftEntraIDTokenVerifier = microsoftEntraIDTokenVerifier;
    }

    public Mono<ServerResponse> signIn(ServerRequest req) {
        return req.bodyToMono(LoginRequest.class)
            .flatMap(request -> {
                String token = request.getToken();
                TokenType type = request.getType();
                try {
                    TokenVerifier verifier = getTokenVerifier(type);
                    token = verifier.verifiyToken(token);
                    return this.repository.addToken(token)
                        .flatMap(res -> ServerResponse.ok().body(Mono.just(res), LoginResponse.class));
                } catch (TokenVerificiationException e) {
                    this.logger.error(e.getMessage());
                    return ServerResponse.status(403).bodyValue("An error ocurred during sign in");
                }
            });
    }   

    private TokenVerifier getTokenVerifier(TokenType type) throws TokenVerificiationException {
        switch (type) {
            case GOOGLE:
                throw new TokenVerificiationException("This verifier does not exist");
            case MICROSOFT_ENTRA_ID:
                return this.microsoftEntraIDTokenVerifier;
            default:
                throw new TokenVerificiationException("Source for token not compatible");
        }
    }
}
