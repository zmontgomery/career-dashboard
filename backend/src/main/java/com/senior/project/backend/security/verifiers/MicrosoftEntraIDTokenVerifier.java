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
        token = validateSignature(token);
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

            logger.info(jws.getKey().toString());
            logger.info(jws.verifySignature() + "");

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
            TokenPayload tokenPayload = mapper.readValue(payload, TokenPayload.class);
            return tokenPayload;
        } catch (Exception e) {
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

// {
//   "aud": "ce4bbce1-ee95-4991-8367-c180902da560",
//   "iss": "https://login.microsoftonline.com/24e2ab17-fa32-435d-833f-93888ce006dd/v2.0",
//   "iat": 1698172551,
//   "nbf": 1698172551,
//   "exp": 1698176451,
//   "aio": "AYQAe/8UAAAAfBr5d6SzG0g8FTsJsUlfz9oa3cqfspEB8wu2shNXVEbHDEf9YRVsEXj8fhyzjHQT4NZ8XR15AV9+v7RHYIpgHg+EM13dWVquAD1VzGSLnTdwv15OZf9vSdKouStoAbxwBt/r+bgZRi2BQoUWCoyeQf6gXZl4mnCaGGyulLdnSEw=",
//   "idp": "https://sts.windows.net/9188040d-6c67-4c5b-b112-36a304b66dad/",
//   "name": "James Logan",
//   "nonce": "31e80c12-da7c-4ab2-a1a0-51261950e6b0",
//   "oid": "54c7d394-67a4-43d4-8673-980b52564c71",
//   "preferred_username": "james@dbej.net",
//   "rh": "0.AbcAF6viJDL6XUODP5OIjOAG3eG8S86V7pFJg2fBgJAtpWDJAAg.",
//   "sub": "FuxPHXK6dosxtWZ9Uqk60IKyb9EL9ubwKzKEDB6-qt0",
//   "tid": "24e2ab17-fa32-435d-833f-93888ce006dd",
//   "uti": "AYN7xiuSvkajY6c1XXF-AA",
//   "ver": "2.0"
// }