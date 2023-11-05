package com.senior.project.backend.security.verifiers;

import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
public class MicrosoftEntraIDTokenVerifierTest {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * NOTE
     * It is difficult to test a valid token since it would have to be hard coded and 
     * will expire, meaning it would have to be updated with a valid token to use as a
     * test, which is against the spirit of unit testing
     * 
     * Instead we test for obvious failures
     */
    @Autowired
    private MicrosoftEntraIDTokenVerifier CuT;

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
