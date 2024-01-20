package com.senior.project.backend.security;

import java.io.UnsupportedEncodingException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.NumericDate;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.senior.project.backend.security.domain.AuthInformation;
import com.senior.project.backend.security.domain.TempUser;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;

import jakarta.annotation.PostConstruct;

/**
 * Generates a token using a user as a subject.
 * 
 * Token is then used as a Bearer Token for authentication and Authorization
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class TokenGenerator {
    private Key key;
    private JwtConsumer jwtConsumer;

    @Autowired
    private AuthInformation authInformation;

    /**
     * Generates a JWT token for authentication
     * 
     * @param user - user included in the token
     * @return the new token
     */
    public String generateToken(TempUser user) {
        JsonWebSignature jws = createWebSignature();

        JwtClaims claims = new JwtClaims();
        claims.setSubject(user.getEmail());
        claims.setExpirationTimeMinutesInTheFuture(authInformation.getTokenDuration() / 60);
        claims.setIssuedAtToNow();

        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.HMAC_SHA256);  
        jws.setKey(key);
        jws.setPayload(claims.toJson());  

        try {
            return jws.getCompactSerialization();
        } catch (JoseException e) {
            e.printStackTrace();
            return "failed";
        }
    }

    /**
     * Extracts the user's email from the token
     * 
     * @param token - token being analyzed
     * @return the user's email
     * @throws TokenVerificiationException when an error occurrs
     */
    public String extractEmail(String token) throws TokenVerificiationException {
        try {
            return jwtConsumer.processToClaims(token).getSubject();
        } catch (InvalidJwtException e) {
            throw new TokenVerificiationException("Token was expired.");
        } catch (Exception e) {
            throw new TokenVerificiationException("Token was malformed.");
        }
    }

    /**
     * Extracts the expiration date from the token
     * 
     * @param token - token being analyzed
     * @return the token's expiration date
     * @throws TokenVerificiationException when an error occurrs
     */
    public NumericDate extractExpDate(String token) throws TokenVerificiationException {
        try {
            return jwtConsumer.processToClaims(token).getExpirationTime();
        } catch (InvalidJwtException e) {
            throw new TokenVerificiationException("Token was expired.");
        } catch (Exception e) {
            throw new TokenVerificiationException("Token was malformed.");
        }
    }

    //
    // Private
    //

    /**
     * Initializes the generator by reading in the key and creating the consumer
     * 
     * @throws NoSuchAlgorithmException
     * @throws UnsupportedEncodingException
     */
    @PostConstruct
    private void initTokenGenerator() throws NoSuchAlgorithmException, UnsupportedEncodingException {
        // Load the key
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] bytes = authInformation.getSigningKey().getBytes("UTF-8");
        md.update(bytes);
        byte[] keyBytes = md.digest();

        this.key =  new HmacKey(keyBytes);
        this.jwtConsumer = jwtConsumerFactory();
    }

    /**
     * Creates the JWT reader for extracting claims
     * 
     * @return the created consumer
     */
    private JwtConsumer jwtConsumerFactory() {
        return new JwtConsumerBuilder()
            .setRequireExpirationTime()
            .setRequireIssuedAt()
            .setVerificationKey(this.key)
            .build();
    }

    /**
     * Creates a new JsonWebSignature
     * 
     * Used for unit tests
     * 
     * @return
     */
    protected JsonWebSignature createWebSignature() {
        return new JsonWebSignature();
    }
}
