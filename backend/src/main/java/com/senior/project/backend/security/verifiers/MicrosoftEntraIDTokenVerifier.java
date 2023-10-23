package com.senior.project.backend.security.verifiers;

import org.springframework.stereotype.Component;

@Component
public class MicrosoftEntraIDTokenVerifier implements TokenVerifier {

    @Override
    public String verifiyToken(String token) throws TokenVerificiationException{
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'verifiyToken'");
    }
    
}
