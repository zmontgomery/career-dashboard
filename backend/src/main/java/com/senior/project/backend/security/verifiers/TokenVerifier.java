package com.senior.project.backend.security.verifiers;

public interface TokenVerifier {
    String verifiyIDToken(String token) throws TokenVerificiationException;
    String verifiyAccessToken(String token) throws TokenVerificiationException;
}
