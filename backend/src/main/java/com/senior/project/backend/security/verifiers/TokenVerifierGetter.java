package com.senior.project.backend.security.verifiers;

import org.springframework.stereotype.Component;

import com.senior.project.backend.security.domain.TokenType;

@Component
public class TokenVerifierGetter {
    private MicrosoftEntraIDTokenVerifier microsoftEntraIDTokenVerifier;
    private GoogleTokenVerifier googleTokenVerifier;

    public TokenVerifierGetter(
        MicrosoftEntraIDTokenVerifier microsoftEntraIDTokenVerifier,
        GoogleTokenVerifier googleTokenVerifier
    ) {
        this.microsoftEntraIDTokenVerifier = microsoftEntraIDTokenVerifier;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    public TokenVerifier getTokenVerifier(TokenType type) throws TokenVerificiationException {
        switch (type) {
            case GOOGLE:
                return this.googleTokenVerifier;
            case MICROSOFT_ENTRA_ID:
                return this.microsoftEntraIDTokenVerifier;
            default:
                throw new TokenVerificiationException("Source for token not compatible");
        }
    }
}
