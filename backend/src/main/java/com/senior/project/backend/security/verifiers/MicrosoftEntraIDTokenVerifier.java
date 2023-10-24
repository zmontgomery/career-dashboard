package com.senior.project.backend.security.verifiers;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.util.Base64;

import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.JsonWebKeySet;
import org.jose4j.jwk.VerificationJwkSelector;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;


@Component
public class MicrosoftEntraIDTokenVerifier implements TokenVerifier {

    private final Logger logger = LoggerFactory.getLogger(MicrosoftEntraIDTokenVerifier.class);
    private JsonWebKeySet keySet;

    public MicrosoftEntraIDTokenVerifier(ResourceLoader resourceLoader) throws JoseException {
        String keys = resourceAsString(resourceLoader.getResource("classpath:keys.json"));
        keySet = new JsonWebKeySet(keys);
    }

    /**
     * Verifies a provided token
     * 
     * TODO Verify the token 
     */
    @Override
    public String verifiyIDToken(String token) throws TokenVerificiationException {
        token = verifyStructure(token);
        token = validateClaims(token);
        return token;
    }

    /**
     * Verifies a provided token
     * 
     * TODO Verify the token 
     */
    @Override
    public String verifiyAccessToken(String token) throws TokenVerificiationException {
        token = verifyStructure(token);
        token = validateClaims(token);
        return token;
    }

    private String verifyStructure(String token) throws TokenVerificiationException {
        String[] segments = token.split("\\.");

        if (token.length() % 4 != 0) {
            throw new TokenVerificiationException("Provided token was not in base 64");
        }

        if (segments.length != 3) {
            throw new TokenVerificiationException("Provided token had incorrect number of segments");
        }

        for (String segment : segments) {
            logger.info("" + segments.length % 4);
            if (!isBase64(segment)) {
                throw new TokenVerificiationException("Provided token was not in base 64");
            }
        }

        return token;
    }

    private String validateSignautre(String token) throws TokenVerificiationException {
        try {
            JsonWebSignature jws = new JsonWebSignature();
            jws.setAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST, AlgorithmIdentifiers.RSA_USING_SHA256));
            jws.setCompactSerialization(token);
            VerificationJwkSelector jwkSelector = new VerificationJwkSelector();
            JsonWebKey jwk = jwkSelector.select(jws, keySet.getJsonWebKeys());
            jws.setKey(jwk.getKey());

            if (jws.verifySignature()) {
                return token;
            } else {
                throw new TokenVerificiationException("Token was not validated");
            }

        } catch (JoseException e) {
            throw new TokenVerificiationException("Token was not validated");
        }
    }

    private String validateClaims(String token) throws TokenVerificiationException {
        return token;
    }

    private boolean isBase64(String src) {
        try {
            Base64.getDecoder().decode(src);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private static String resourceAsString(Resource resource) {
        try (Reader reader = new InputStreamReader(resource.getInputStream())) {
            return FileCopyUtils.copyToString(reader);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}