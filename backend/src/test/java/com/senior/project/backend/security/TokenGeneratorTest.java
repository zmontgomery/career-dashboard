package com.senior.project.backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.domain.AuthInformation;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(OrderAnnotation.class)
public class TokenGeneratorTest {
    
    @InjectMocks
    private TokenGenerator CuT;

    @Mock
    private AuthInformation authInformation;

    private static final User user = Constants.userAdmin;

    private static String token;
    private static Long now;

    @Test
    @Order(1)
    public void tokenHappy() throws TokenVerificiationException {
        generateToken();

        String emailResult = CuT.extractEmail(token);
        assertEquals(user.getEmail(), emailResult);

        Long expResult = CuT.extractExpDate(token).getValueInMillis();

        assertTrue(Math.abs(now - expResult) < 5000);
    }

    @Test
    @Order(2)
    public void generateTokenFailure() throws JoseException {
        CuT = spy(CuT);
        JsonWebSignature fakeJws = Mockito.mock(JsonWebSignature.class);
        when(authInformation.getTokenDuration()).thenReturn(3600L);
        when(fakeJws.getCompactSerialization()).thenThrow(new JoseException("fail"));        
        doReturn(fakeJws).when(CuT).createWebSignature();

        String result = CuT.generateToken(user);

        assertEquals("failed", result);
    }

    @Test
    @Order(3)
    public void tokenUnhappyExpired() throws TokenVerificiationException, InvalidJwtException {
        generateToken();

        JwtConsumer fakeConsumer = Mockito.mock(JwtConsumer.class);
        when(fakeConsumer.processToClaims(anyString())).thenThrow(new InvalidJwtException(token, null, null));  
        ReflectionTestUtils.setField(CuT, "jwtConsumer", fakeConsumer);

        try {
            CuT.extractEmail(token);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            assertEquals(e.getMessage(), "Token was expired.");
        }

        try {
            CuT.extractExpDate(token);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            assertEquals(e.getMessage(), "Token was expired.");
        }
    }

    @Test
    @Order(4)
    public void tokenUnhappyMalformed() throws TokenVerificiationException, InvalidJwtException, MalformedClaimException {
        generateToken();

        JwtConsumer fakeConsumer = Mockito.mock(JwtConsumer.class);
        JwtClaims fakaClaims = Mockito.mock(JwtClaims.class);
        when(fakaClaims.getSubject()).thenThrow(new MalformedClaimException(""));
        when(fakaClaims.getExpirationTime()).thenThrow(new MalformedClaimException(""));
        when(fakeConsumer.processToClaims(anyString())).thenReturn(fakaClaims);  
        ReflectionTestUtils.setField(CuT, "jwtConsumer", fakeConsumer);

        try {
            CuT.extractEmail(token);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            assertEquals(e.getMessage(), "Token was malformed.");
        }

        try {
            CuT.extractExpDate(token);
            fail("Error should have been thrown");
        } catch (TokenVerificiationException e) {
            assertEquals(e.getMessage(), "Token was malformed.");
        }
    }

    private void generateToken() {
        when(authInformation.getSigningKey()).thenReturn("key");
        ReflectionTestUtils.invokeMethod(CuT, "initTokenGenerator");
        CuT = spy(CuT);
        when(authInformation.getTokenDuration()).thenReturn(3600L);

        String result = CuT.generateToken(user);
        now = System.currentTimeMillis() + 3600000;

        assertNotEquals("failed", result);
        token = result;
    }
}
