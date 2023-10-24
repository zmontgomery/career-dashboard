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
                String accessToken = request.getAccessToken();
                String idToken = request.getIdToken();
                TokenType type = request.getType();
                try {
                    TokenVerifier verifier = getTokenVerifier(type);
                    String oid = verifier.verifiyIDToken(accessToken);
                    return this.repository.addToken(accessToken, oid)
                        .flatMap(res -> ServerResponse.ok().body(Mono.just(res), LoginResponse.class));
                } catch (TokenVerificiationException e) {
                    this.logger.error(e.getMessage());
                    return ServerResponse.status(403).bodyValue("An error ocurred during sign in");
                }
            });
    }   

    public Mono<ServerResponse> signOut(ServerRequest req) {
        return ServerResponse.ok().body(Mono.just(""), String.class);
    }

    //
    // Helper methods
    //

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
