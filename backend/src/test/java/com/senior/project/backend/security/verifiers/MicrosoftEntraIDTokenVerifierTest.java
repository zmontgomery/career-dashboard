package com.senior.project.backend.security.verifiers;

import static org.junit.jupiter.api.Assertions.fail;

import com.senior.project.backend.security.domain.AuthInformation;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.io.IOException;


@ExtendWith(MockitoExtension.class)
public class MicrosoftEntraIDTokenVerifierTest {

    @Mock
    private AuthInformation authInformation;

    @Mock
    private MicrosoftKeyset microsoftKeyset;


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
        CuT = new MicrosoftEntraIDTokenVerifier(authInformation, microsoftKeyset);
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
