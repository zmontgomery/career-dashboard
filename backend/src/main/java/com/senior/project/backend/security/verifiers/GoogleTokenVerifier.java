package com.senior.project.backend.security.verifiers;

import java.util.Collections;

import org.springframework.stereotype.Component;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.senior.project.backend.security.domain.GoogleAuthInformation;

@Component
public class GoogleTokenVerifier implements TokenVerifier {

    private GoogleAuthInformation googleAuthInformation;
    private NetHttpTransport transport;
    private GsonFactory factory;

    public GoogleTokenVerifier(GoogleAuthInformation googleAuthInformation) {
        this.googleAuthInformation = googleAuthInformation;
        this.transport = new NetHttpTransport();
        this.factory = new GsonFactory();
    }

    @Override
    public String verifiyIDToken(String token) throws TokenVerificiationException {
        String clientID = this.googleAuthInformation.getClientId();
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
