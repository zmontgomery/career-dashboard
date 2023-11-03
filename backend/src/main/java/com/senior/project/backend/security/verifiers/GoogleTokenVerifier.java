package com.senior.project.backend.security.verifiers;

import java.util.Collections;

import org.springframework.stereotype.Component;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.senior.project.backend.security.domain.AuthInformation;

/**
 * A TokenVerifier that verifies a token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class GoogleTokenVerifier implements TokenVerifier {

    private AuthInformation authInformation;
    private NetHttpTransport transport;
    private GsonFactory factory;

    public GoogleTokenVerifier(AuthInformation authInformation) {
        this.authInformation = authInformation;
        this.transport = new NetHttpTransport();
        this.factory = new GsonFactory();
    }

    /**
     * Verifies an ID token by verifying its structures, signature, and claims
     * 
     * @param token - token being verified
     * @return - A unique id for the user
     * @throws TokenVerificiationException - thrown when an error occurs during the verification
     */
    @Override
    public String verifiyIDToken(String token) throws TokenVerificiationException {
        String clientID = this.authInformation.getGClientId();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, factory)
            .setAudience(Collections.singletonList(clientID))
            .build();
        GoogleIdToken gToken;

        try {
            gToken = verifier.verify(token);
            return gToken.getPayload().getEmail();
        } catch (Exception e) {
            throw new TokenVerificiationException("Token was not validated");
        }
    }   
}
