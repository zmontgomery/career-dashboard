package com.senior.project.backend.security.verifiers;

import org.springframework.stereotype.Component;

@Component
public class MicrosoftEntraIDTokenVerifier implements TokenVerifier {

    /**
     * Verifies a provided token
     * 
     * TODO Verify the token 
     */
    @Override
    public String verifiyToken(String token) throws TokenVerificiationException{
        throw new TokenVerificiationException("Test");
        // return token;
    }
}