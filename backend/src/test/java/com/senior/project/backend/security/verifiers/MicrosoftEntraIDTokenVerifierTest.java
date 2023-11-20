package com.senior.project.backend.security.verifiers;

import static org.junit.jupiter.api.Assertions.fail;

import com.senior.project.backend.security.domain.AuthInformation;
import org.jose4j.jwk.JsonWebKeySet;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;


@ExtendWith(MockitoExtension.class)
public class MicrosoftEntraIDTokenVerifierTest {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Mock()
    private ResourceLoader resourceLoader;

    @Mock
    private AuthInformation authInformation;

    @Mock
    private Resource resource;

    @Mock
    private InputStream inputStream;

    /**
     * NOTE
     * It is difficult to test a valid token since it would have to be hard coded and 
     * will expire, meaning it would have to be updated with a valid token to use as a
     * test, which is against the spirit of unit testing
     * 
     * Instead we test for obvious failures
     */
    private MicrosoftEntraIDTokenVerifier CuT;

    @BeforeEach
    public void setup() throws JoseException, IOException {
        when(resourceLoader.getResource(anyString())).thenReturn(resource);
        when(resource.getInputStream()).thenReturn(new ByteArrayInputStream("test data".getBytes()));

        try(MockedConstruction<JsonWebKeySet> mockJsonWebKeySet = Mockito.mockConstruction(JsonWebKeySet.class)) {
            CuT = new MicrosoftEntraIDTokenVerifier(resourceLoader, authInformation);
        }
    }

    @Test
    public void unhappyPathStructure() throws TokenVerificiationException {
        String invalidToken = ":)";

        try {
            CuT.verifiyIDToken(invalidToken);
            fail("Token should have been validated");
        } catch(Exception e) {
            return;
        }
    }

    @Test
    public void unhappyPathSignature() throws TokenVerificiationException {
        String invalidToken = "1.2.3";

        try {
            CuT.verifiyIDToken(invalidToken);
            fail("Token should not have been validated");
        } catch(Exception e) {
            return;
        }
    }
}
