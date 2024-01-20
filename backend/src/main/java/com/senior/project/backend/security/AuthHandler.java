package com.senior.project.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
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

    private static final String AUTHORIZATION_HEADER = "X-Authorization";

    private final Logger logger = LoggerFactory.getLogger(AuthHandler.class);

    private final Mono<ServerResponse> authFailedResponse = ServerResponse.status(401).bodyValue("Unauthorized.");
    private final Mono<ServerResponse> errorResponse = ServerResponse.status(403).bodyValue("An error ocurred during sign in");
    private final Mono<ServerResponse> refreshErrorResponse = ServerResponse.status(403).bodyValue("An error ocurred when refreshing the token");

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
                        .flatMap(authService::login)
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
    
    public Mono<ServerResponse> refresh(ServerRequest req) {
        try {
            String token = req
                .headers()
                .header(AUTHORIZATION_HEADER)
                .get(0)
                .split("Bearer ")[1];

            return authService.refreshToken(token)
                .flatMap(res -> ServerResponse.ok().body(Mono.just(res), LoginResponse.class));
        } catch (Exception e) {
            logger.error(e.getMessage());
            return refreshErrorResponse;
        }
    }

    public Mono<ServerResponse> authenticationFailed(ServerRequest req) {
        return authFailedResponse;
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
    private Mono<TempUser> findUserByEmail(String email) {
        return Mono.just(TempUser.builder().email("jrl9984@rit.edu").build());
    }
}
