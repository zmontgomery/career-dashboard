package com.senior.project.backend.security.verifiers;

/**
 * Error that is thrown during token verification
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public class TokenVerificiationException extends Exception {
    public TokenVerificiationException(String message) {
        super(message);
    }
}
