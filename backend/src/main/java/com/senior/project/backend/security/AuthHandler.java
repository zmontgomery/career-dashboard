package com.senior.project.backend.security;

import java.util.Date;
import java.util.UUID;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;
import com.senior.project.backend.security.domain.TokenType;
import com.senior.project.backend.security.verifiers.TokenVerifier;
import com.senior.project.backend.security.verifiers.TokenVerifierGetter;

import reactor.core.publisher.Mono;

/**
 * Handler for authentication functions
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class AuthHandler {

    private final Logger logger = LoggerFactory.getLogger(AuthHandler.class);

    private final Mono<ServerResponse> errorResponse = ServerResponse.status(403).bodyValue("An error ocurred during sign in");

    private final AuthRepository repository;
    private final TokenVerifierGetter tokenVerifierGetter;

    public AuthHandler(
        AuthRepository repository,
        TokenVerifierGetter tokenVerifierGetter
    ) {
        this.repository = repository;
        this.tokenVerifierGetter = tokenVerifierGetter;
    }

    /**
     * Handler function for signing in
     * 
     * The function gets the data from the login request and verifies the authentication token
     * In the case an error ocurrs, the fucntion catches the error
     * 
     * @param req - the server request with the login request
     * @return 
     *      200 for successful login
     *      403 If an error ocurred during sign in
     */
    public Mono<ServerResponse> signIn(ServerRequest req) {
        return req.bodyToMono(LoginRequest.class)
            .flatMap(request -> {
                String idToken = request.getIdToken();
                TokenType type = request.getTokenType();
                try {
                    TokenVerifier verifier = this.tokenVerifierGetter.getTokenVerifier(type);
                    String email = verifier.verifiyIDToken(idToken);

                    return this.repository.findUserByEmail(email)
                        .flatMap(user -> this.createSession(user))
                        .flatMap(session -> Mono.just(
                            LoginResponse.builder()
                                .sessionID(session.getSessionID())
                                .user(session.getUser())
                                .build())
                        )
                        .switchIfEmpty(Mono.empty())
                        .flatMap(res -> ServerResponse.ok().body(Mono.just(res), LoginResponse.class))
                        .switchIfEmpty(errorResponse);
                } catch (Exception e) {
                    this.logger.error(e.getMessage());
                    
                    // Obscure the reason for failure
                    return errorResponse;
                }
            });
    }   

    /**
     * Signs out a user
     * 
     * TODO Implement
     * 
     * @param req
     * @return
     */
    public Mono<ServerResponse> signOut(ServerRequest req) {
        return ServerResponse.ok().body(Mono.just(""), String.class);
    }

    //
    // Helper Methods
    //

    private Mono<Session> createSession(TempUser user) {
        if (repository.userHasSession(user)) {
            return Mono.empty();
        }

        Date now = new Date(Instant.now().toEpochMilli());
        UUID sessionId = UUID.randomUUID();

        Session session = Session.builder()
            .user(user)
            .signInDate(now)
            // Add a day to the expiration 
            .expiryDate(Date.from(now.toInstant().plusSeconds(86400)))
            .sessionID(sessionId)
            .build();

        return repository.addSession(session);
    }
}
