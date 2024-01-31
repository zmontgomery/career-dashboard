package com.senior.project.backend.security.verifiers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.senior.project.backend.security.domain.AuthInformation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.security.GeneralSecurityException;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Test for google token verifier
 * 
 * 
 * NOTE: We can't really test for success since we would have to 
 * hard code a token
 */
@ExtendWith(MockitoExtension.class)
public class GoogleTokenVerifierTest {

    @InjectMocks
    private GoogleTokenVerifier CuT;

    @Mock
    GoogleIdTokenVerifier tokenVerifier;

    @Mock
    GoogleIdToken token;

    @Mock
    Payload payload;

    @Mock
    AuthInformation authInformation;

    @BeforeEach
    public void setup() throws GeneralSecurityException, IOException {
        ReflectionTestUtils.setField(CuT, "googleIdTokenVerifier", tokenVerifier);
    }

    @Test
    public void happyPath() throws TokenVerificiationException, GeneralSecurityException, IOException {
        when(token.getPayload()).thenReturn(payload);
        when(payload.getEmail()).thenReturn("a@a.a");
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
