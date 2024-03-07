package com.senior.project.backend.security.verifiers;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.webtoken.JsonWebSignature;
import com.google.api.client.json.webtoken.JsonWebSignature.Parser;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.senior.project.backend.security.domain.AuthInformation;
import com.senior.project.backend.security.verifiers.GoogleTokenVerifier.PayloadWithName;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.security.GeneralSecurityException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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

    @Test
    public void testGetName() throws IOException, TokenVerificiationException {
        MockedStatic<JsonWebSignature> jsonMockedStatic = mockStatic(JsonWebSignature.class);
        PayloadWithName payloadWithName = mock(PayloadWithName.class);
        JsonWebSignature jsonWebSignature = mock(JsonWebSignature.class);
        Parser parser = mock(Parser.class);
        JsonFactory jsonFactory = mock(JsonFactory.class);
        when(tokenVerifier.getJsonFactory()).thenReturn(jsonFactory);
        when(parser.setPayloadClass(any())).thenReturn(parser);
        when(parser.parse(anyString())).thenReturn(jsonWebSignature);
        when(jsonWebSignature.getPayload()).thenReturn(payloadWithName);
        when(payloadWithName.getName()).thenReturn("name");
        jsonMockedStatic.when(() -> JsonWebSignature.parser(any())).thenReturn(parser);

        String actual = CuT.retrieveName("token");

        assertEquals(actual, "name");
        verify(tokenVerifier, times(1)).getJsonFactory();
        verify(parser, times(1)).setPayloadClass(PayloadWithName.class);
        verify(parser, times(1)).parse("token");

        jsonMockedStatic.close();
    }

    @Test
    public void testGetNameFailure() throws IOException, TokenVerificiationException {
        MockedStatic<JsonWebSignature> jsonMockedStatic = mockStatic(JsonWebSignature.class);
        Parser parser = mock(Parser.class);
        JsonFactory jsonFactory = mock(JsonFactory.class);
        when(tokenVerifier.getJsonFactory()).thenReturn(jsonFactory);
        when(parser.setPayloadClass(any())).thenReturn(parser);
        when(parser.parse(anyString())).thenThrow(new IOException());
        jsonMockedStatic.when(() -> JsonWebSignature.parser(any())).thenReturn(parser);

        assertThrows(TokenVerificiationException.class, () -> CuT.retrieveName("token"));
        jsonMockedStatic.close();
    }
}
