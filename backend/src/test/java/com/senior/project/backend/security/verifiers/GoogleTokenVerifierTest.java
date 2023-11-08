package com.senior.project.backend.security.verifiers;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.security.GeneralSecurityException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

/**
 * Test for google token verifier
 * 
 * 
 * NOTE: We can't really test for success since we would have to 
 * hard 
 */
@SpringBootTest
public class GoogleTokenVerifierTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private GoogleTokenVerifier CuT;

    GoogleIdTokenVerifier tokenVerifier = mock(GoogleIdTokenVerifier.class);
    GoogleIdToken token = mock(GoogleIdToken.class);
    Payload payload = mock(Payload.class);

    @BeforeEach
    public void setup() throws GeneralSecurityException, IOException {
        ReflectionTestUtils.setField(CuT, "googleIdTokenVerifier", tokenVerifier);
        when(token.getPayload()).thenReturn(payload);
        when(payload.getEmail()).thenReturn("a@a.a");
    }

    @Test
    public void happyPath() throws TokenVerificiationException, GeneralSecurityException, IOException {
        when(tokenVerifier.verify(anyString())).thenReturn(token);

        String invalidToken = ":)";

        try {
            CuT.verifiyIDToken(invalidToken);
            return;
        } catch(Exception e) {
            fail("Token should have been validated");
        }
    }

    @Test
    public void unhappyPath() throws TokenVerificiationException, GeneralSecurityException, IOException {
        when(tokenVerifier.verify(anyString())).thenThrow(new IOException(""));

        String invalidToken = ":)";

        try {
            CuT.verifiyIDToken(invalidToken);
            fail("Token should not have been validated");
        } catch(Exception e) {
            return;
        }
    }
}
