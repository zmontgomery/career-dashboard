package com.senior.project.backend.security.verifiers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.senior.project.backend.TestUtil;
import com.senior.project.backend.security.domain.AuthInformation;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.io.IOException;
import java.security.KeyPair;


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
        TestUtil.testError(() -> CuT.verifiyIDToken(invalidToken), TokenVerificiationException.class);
    }

    @Test
    public void unhappyPathSignature() throws TokenVerificiationException {
        String invalidToken = "1.2.3";
        TestUtil.testError(() -> CuT.verifiyIDToken(invalidToken), TokenVerificiationException.class);
    }

    @Test
    public void happy() throws TokenVerificiationException {
        KeyPair pair = TestUtil.getKey();

        when(microsoftKeyset.getKeySet()).thenReturn(TestUtil.getKeyset(pair));
        when(authInformation.getMsClientId()).thenReturn("client_id");

        String email = CuT.verifiyIDToken(TestUtil.generateValidToken(pair));

        assertEquals("success@winning.com", email);
    }

    @Test
    public void invalidSignature() throws TokenVerificiationException {
        KeyPair pair = TestUtil.getKey();
        KeyPair pair2 = TestUtil.getKey();

        when(microsoftKeyset.getKeySet()).thenReturn(TestUtil.getKeyset(pair));

        TestUtil.testError(() -> CuT.verifiyIDToken(TestUtil.generateValidToken(pair2)), TokenVerificiationException.class);
    }

    @Test
    public void noJwk() throws TokenVerificiationException {
        KeyPair pair = TestUtil.getKey();

        when(microsoftKeyset.getKeySet()).thenReturn(TestUtil.getKeyset(pair));

        TestUtil.testError(() -> CuT.verifiyIDToken(TestUtil.generateTokenWithKID(pair, "2")), TokenVerificiationException.class);
    }

    @Test
    public void expired() throws TokenVerificiationException {
        KeyPair pair = TestUtil.getKey();

        when(microsoftKeyset.getKeySet()).thenReturn(TestUtil.getKeyset(pair));
        when(authInformation.getMsClientId()).thenReturn("client_id");

        TestUtil.testError(() -> CuT.verifiyIDToken(TestUtil.generateExpiredToken(pair)), TokenVerificiationException.class);
    }
}
