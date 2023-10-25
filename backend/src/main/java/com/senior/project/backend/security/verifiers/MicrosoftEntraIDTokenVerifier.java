package com.senior.project.backend.security.verifiers;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;

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

import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.security.domain.TokenPayload;


@Component
public class MicrosoftEntraIDTokenVerifier implements TokenVerifier {

    private final Logger logger = LoggerFactory.getLogger(MicrosoftEntraIDTokenVerifier.class);
    private JsonWebKeySet keySet;

    public MicrosoftEntraIDTokenVerifier(ResourceLoader resourceLoader) throws JoseException {
        String keys = resourceAsString(resourceLoader.getResource("classpath:keys.json"));
        keySet = new JsonWebKeySet(keys);
    }

    /**
     * Verifies a provided token and returns the user's email
     */
    @Override
    public String verifiyIDToken(String token) throws TokenVerificiationException {
        token = verifyStructure(token);
        String payload = validateSignature(token);
        TokenPayload tokenPayload = validateClaims(payload);
        return tokenPayload.getOid();
    }

    /**
     * Verifies a provided token and returns the token after validation
     */
    @Override
    public String verifiyAccessToken(String token) throws TokenVerificiationException {
        token = verifyStructure(token);
        validateSignature(token);
        return token;
    }

    private String verifyStructure(String token) throws TokenVerificiationException {
        String[] segments = token.split("\\.");

        if (segments.length != 3) {
            throw new TokenVerificiationException("Provided token had incorrect number of segments");
        }

        return token;
    }

    private String validateSignature(String token) throws TokenVerificiationException {
        try {
            JsonWebSignature jws = new JsonWebSignature();
            jws.setAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST, AlgorithmIdentifiers.RSA_USING_SHA256));
            jws.setCompactSerialization(token);
            VerificationJwkSelector jwkSelector = new VerificationJwkSelector();
            JsonWebKey jwk = jwkSelector.select(jws, keySet.getJsonWebKeys());
            jws.setKey(jwk.getKey());

            if (jws.verifySignature()) {
                return jws.getPayload();
            } else {
                throw new TokenVerificiationException("Token was not validated");
            }

        } catch (JoseException e) {
            throw new TokenVerificiationException("Token was not validated");
        }
    }

    private TokenPayload validateClaims(String payload) throws TokenVerificiationException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            TokenPayload tokenPayload = mapper.readValue(payload, TokenPayload.class);

            

            return tokenPayload;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new TokenVerificiationException("Error occured validating the token claims");
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