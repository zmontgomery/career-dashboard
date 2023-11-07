package com.senior.project.backend.security.verifiers;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.senior.project.backend.security.domain.TokenType;

@SpringBootTest
public class TokenVerifierGetterTest {
    
    @Autowired
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
