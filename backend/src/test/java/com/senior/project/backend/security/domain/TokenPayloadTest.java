package com.senior.project.backend.security.domain;

import com.senior.project.backend.AbstractDomainObjectTest;
import com.senior.project.backend.Pair;

public class TokenPayloadTest extends AbstractDomainObjectTest <TokenPayload> {
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

    public TokenPayloadTest() {
        super(new TokenPayload(AUD, ISS, IAT, NBF, EXP, NAME, NONCE, OID, EMAIL, USERNAME, RH, SUB, TID, UTI, VER),
            new Pair<>("aud", AUD),
            new Pair<>("iss", ISS),
            new Pair<>("iat", IAT),
            new Pair<>("nbf", NBF),
            new Pair<>("exp", EXP),
            new Pair<>("name", NAME),
            new Pair<>("nonce", NONCE),
            new Pair<>("oid", OID),
            new Pair<>("email", EMAIL),
            new Pair<>("prefferedUsername", USERNAME),
            new Pair<>("rh", RH),
            new Pair<>("sub", SUB),
            new Pair<>("tid", TID),
            new Pair<>("uti", UTI),
            new Pair<>("ver", VER)
        );
    }

    @Override
    protected Class<TokenPayload> getTestClass() {
        return TokenPayload.class;
    }
}
