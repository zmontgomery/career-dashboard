package com.senior.project.backend.security.verifiers;

import com.senior.project.backend.security.domain.TokenType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.fail;

@ExtendWith(MockitoExtension.class)
public class TokenVerifierGetterTest {

    @Mock
    private MicrosoftEntraIDTokenVerifier microsoftEntraIDTokenVerifier;

    @Mock
    private GoogleTokenVerifier googleTokenVerifier;
    
    @InjectMocks
    private TokenVerifierGetter CuT;

    @Test
    public void testMS() throws TokenVerificiationException {
        TokenVerifier verifier = CuT.getTokenVerifier(TokenType.MICROSOFT_ENTRA_ID);

        assertInstanceOf(MicrosoftEntraIDTokenVerifier.class, verifier);
    }    

     @Test
    public void testGoogle() throws TokenVerificiationException {
        TokenVerifier verifier = CuT.getTokenVerifier(TokenType.GOOGLE);

        assertInstanceOf(GoogleTokenVerifier.class, verifier);
    }    

     @Test
    public void testUnhappy() throws TokenVerificiationException {
        try {
            CuT.getTokenVerifier(TokenType.DEFAULT);
            fail("Instance was somehow found");
        } catch (TokenVerificiationException e) {
            return;
        }
    }    
}
