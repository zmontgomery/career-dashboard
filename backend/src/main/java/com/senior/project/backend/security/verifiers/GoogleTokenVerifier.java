package com.senior.project.backend.security.verifiers;

import java.util.Collections;

import org.springframework.stereotype.Component;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.json.webtoken.JsonWebSignature;
import com.google.api.client.util.Key;
import com.senior.project.backend.security.domain.AuthInformation;

/**
 * A TokenVerifier that verifies a token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class GoogleTokenVerifier implements TokenVerifier {

    private NetHttpTransport transport;
    private GsonFactory factory;
    private GoogleIdTokenVerifier googleIdTokenVerifier;

    public GoogleTokenVerifier(AuthInformation authInformation) {
        this.transport = new NetHttpTransport();
        this.factory = new GsonFactory();
        this.googleIdTokenVerifier = new GoogleIdTokenVerifier.Builder(transport, factory)
            .setAudience(Collections.singletonList(authInformation.getGClientId()))
            .build();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String verifiyIDToken(String token) throws TokenVerificiationException {
        GoogleIdToken gToken;
        try {
            gToken = googleIdTokenVerifier.verify(token);
            return gToken.getPayload().getEmail();
        } catch (Exception e) {
            throw new TokenVerificiationException("Token was not validated");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String retrieveName(String token) throws TokenVerificiationException {
        try {
            JsonWebSignature jws = JsonWebSignature.parser(googleIdTokenVerifier.getJsonFactory())
                    .setPayloadClass(PayloadWithName.class)
                    .parse(token);
            PayloadWithName payload = (PayloadWithName) jws.getPayload();
            return payload.getName();
        } catch (Exception e) {
            throw new TokenVerificiationException("Token was not validated");
        }
    }   

    /**
     * Payload class that has the name property
     */
    public static class PayloadWithName extends Payload {
        @Key("name")
        private String name;

        public String getName() {
            return name;
        }
    }
}
