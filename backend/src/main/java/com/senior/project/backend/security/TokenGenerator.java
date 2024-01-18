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

@Component
public class TokenGenerator {
    private Key key;
    private JwtConsumer jwtConsumer;

    private static final String SUBJECT = "sub";
    private static final String EXPIRY = "exp";

    @Autowired
    private AuthInformation authInformation;

    public String generateToken(TempUser user) {
        JsonWebSignature jws = new JsonWebSignature();

        JwtClaims claims = new JwtClaims();
        claims.setSubject(user.getEmail());
        claims.setExpirationTimeMinutesInTheFuture(3600);
        claims.setIssuedAtToNow();

        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.HMAC_SHA256);  
        jws.setKey(key);
        jws.setPayload(claims.toJson());  

        try {
            return jws.getCompactSerialization();
        } catch (JoseException e) {
            e.printStackTrace();
            return "";
        }
    }

    public String extractEmail(String token) throws TokenVerificiationException {
        return extractClaim(token, SUBJECT);
    }

    public NumericDate extractExpDate(String token) throws TokenVerificiationException {
        return extractClaim(token, EXPIRY);
    }

    //
    // Private
    //

    private <T> T extractClaim(String token, String claim) throws TokenVerificiationException {
        try {
            return (T) jwtConsumer.processToClaims(token).getClaimValue(claim);
        } catch (InvalidJwtException e) {
            throw new TokenVerificiationException("Token was expired.");
        } catch (Exception e) {
            throw new TokenVerificiationException("Token was malformed.");
        }
    }

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

    private JwtConsumer jwtConsumerFactory() {
        return new JwtConsumerBuilder()
            .setRequireExpirationTime()
            .setRequireIssuedAt()
            .setVerificationKey(this.key)
            .build();
    }
}
