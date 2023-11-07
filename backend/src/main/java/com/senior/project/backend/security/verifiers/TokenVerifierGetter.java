package com.senior.project.backend.security.verifiers;

import org.springframework.stereotype.Component;

import com.senior.project.backend.security.domain.TokenType;

/**
 * Class for sourcing the token verifiers based on a TokenType enum value
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
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

    /**
     * Gets a token verifier based on a token type
     * 
     * @param type - source of the token
     * @return - the correct verifier per token
     * @throws TokenVerificiationException
     */
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
