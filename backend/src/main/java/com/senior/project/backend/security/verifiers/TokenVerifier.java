package com.senior.project.backend.security.verifiers;

public interface TokenVerifier {
    String verifiyToken(String token) throws TokenVerificiationException;
}
