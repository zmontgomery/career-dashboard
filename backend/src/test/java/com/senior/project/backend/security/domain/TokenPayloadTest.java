package com.senior.project.backend.security.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TokenPayloadTest {
    private static final String AUD = "me";
    private static final String ISS = "iss";
    private static int IAT = 100;
    private static int NBF = 101;
    private static int EXP = 102;
    private static String NAME = "Name";
    private static String NONCE = "345678";
    private static String OID = "id";
    private static String EMAIL = "mail";
    private static String USERNAME = "adsf";
    private static String RH = "a";
    private static final String SUB = "sub";
    private static String TID = "b";
    private static String UTI = "adf";
    private static String VER = "version";

    private TokenPayload CuT;

    public TokenPayloadTest() {
        CuT = new TokenPayload(AUD, ISS, IAT, NBF, EXP, NAME, NONCE, OID, EMAIL, USERNAME, RH, SUB, TID, UTI, VER);
    }

    @Test
    public void testGetters() {
        assertEquals(CuT.getAud(), AUD);
        assertEquals(CuT.getIss(), ISS);
        assertEquals(CuT.getIat(), IAT);
        assertEquals(CuT.getNbf(), NBF);
        assertEquals(CuT.getExp(), EXP);
        assertEquals(CuT.getName(), NAME);
        assertEquals(CuT.getNonce(), NONCE);
        assertEquals(CuT.getOid(), OID);
        assertEquals(CuT.getEmail(), EMAIL);
        assertEquals(CuT.getPrefferedUsername(), USERNAME);
        assertEquals(CuT.getRh(), RH);
        assertEquals(CuT.getSub(), SUB);
        assertEquals(CuT.getTid(), TID);
        assertEquals(CuT.getUti(), UTI);
        assertEquals(CuT.getVer(), VER);
    }
}
