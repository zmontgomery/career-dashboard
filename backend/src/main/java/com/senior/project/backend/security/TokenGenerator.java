package com.senior.project.backend.security;

import java.io.UnsupportedEncodingException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.senior.project.backend.security.domain.AuthInformation;
import com.senior.project.backend.security.domain.TempUser;

import jakarta.annotation.PostConstruct;

@Component
public class TokenGenerator {
    private Key key;

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

    @PostConstruct
    private void loadKey() throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] bytes = authInformation.getSigningKey().getBytes("UTF-8");
        md.update(bytes);
        byte[] keyBytes = md.digest();
        this.key =  new HmacKey(keyBytes);
    }
}
