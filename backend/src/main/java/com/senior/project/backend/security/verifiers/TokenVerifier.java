package com.senior.project.backend.security.verifiers;

/**
 * Interface for verifiying an ID token from an authentication source
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public interface TokenVerifier {

    /**
     * Verifies an ID token by verifying its structures, signature, and claims
     * 
     * @param token - token being verified
     * @return - A unique id for the user
     * @throws TokenVerificiationException - thrown when an error occurs during the verification
     */
    String verifiyIDToken(String token) throws TokenVerificiationException;
}
