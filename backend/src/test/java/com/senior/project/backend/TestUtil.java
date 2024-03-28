package com.senior.project.backend;

import static org.junit.jupiter.api.Assertions.fail;

import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.JsonWebKeySet;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.keys.RsaKeyUtil;
import org.jose4j.lang.JoseException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;

import java.security.KeyPair;

public abstract class TestUtil {
    public interface ErrorTest {
        void body() throws Exception;
    }

    public static void setSecurityContext() {
        ReactiveSecurityContextHolder.getContext().subscribe((c) -> {
            c.setAuthentication(new UsernamePasswordAuthenticationToken(Constants.userAdmin, "", Constants.userAdmin.getAuthorities()));
        });
    }

    public static void clearSecurityContext() {
        ReactiveSecurityContextHolder.clearContext();
    }

    public static void testError(ErrorTest test, Class<? extends Exception> exception) {
        try {
            test.body();
            fail(String.format("Exception %s should have been thrown", exception.getName()));
        } catch(Exception e) {
            if (!e.getClass().equals(exception)) 
                fail(String.format("Exception %s should have been thrown; %s was thrown instead", exception.getName(), e.getClass().getName()));
            return;
        }
    }

    public static KeyPair getKey() {
        try {
            return new RsaKeyUtil().generateKeyPair(2048);
        } catch (Exception e) {
            fail(e.getMessage());
            return null;
        }
    }

    public static String getKeyset(KeyPair pair) {
        try {
            JsonWebKey key = JsonWebKey.Factory.newJwk(pair.getPublic());
            key.setKeyId("1");
            return new JsonWebKeySet(key).toJson();
        } catch (JoseException e) {
            fail("Unable to create JWK");
            return "";
        }
    }

    private static String generateToken(boolean expired, KeyPair pair, String kid, String name) {
        JsonWebSignature jws = new JsonWebSignature();

        int expTime = expired ? -10 : 60;

        JwtClaims claims = new JwtClaims();
        claims.setSubject(Constants.userAdmin.getEmail());
        claims.setExpirationTimeMinutesInTheFuture(expTime);
        claims.setIssuedAtToNow();
        claims.setClaim("iat", System.currentTimeMillis() / 1000);
        claims.setClaim("nbf", System.currentTimeMillis() / 1000);
        claims.setClaim("email", "success@winning.com");
        if (name != null) claims.setClaim("name", name);
        claims.setAudience("client_id");

        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);  
        jws.setKey(pair.getPrivate());
        jws.setKeyIdHeaderValue(kid);
        jws.setPayload(claims.toJson());  

        try {
            return jws.getCompactSerialization();
        } catch (JoseException e) {
            fail("Unable to create token");
            return "";
        }
    }

    public static String generateValidToken(KeyPair pair) {
        return generateToken(false, pair, "1", "me");
    }

    public static String generateTokenWithNoName(KeyPair pair) {
        return generateToken(false, pair, null, null);
    }

    public static String generateExpiredToken(KeyPair pair) {
        return generateToken(true, pair, "1", "me");
    }

    public static String generateTokenWithKID(KeyPair pair, String kid) {
        return generateToken(false, pair, kid, "me");
    }
}
