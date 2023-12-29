package com.senior.project.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
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

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenVerifierGetter tokenVerifierGetter;

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

                    return findUserByEmail(email)
                        .flatMap(authService::createSession)
                        .flatMap(authService::generateResponse)
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

    // FIXME this will be replaced by an actual user repository
    @Deprecated
    private Mono<String> findUserByEmail(String email) {
        return Mono.just("testuser@email.com");
    }
}
