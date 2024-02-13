package com.senior.project.backend.security.domain;

import com.senior.project.backend.AbstractDomainObjectTest;
import com.senior.project.backend.Pair;

public class LoginRequestTest extends AbstractDomainObjectTest<LoginRequest> {
    private static final String TOKEN = "Token";
    private static final TokenType TYPE = TokenType.GOOGLE;

    public LoginRequestTest() {
        super(
            new LoginRequest(TOKEN, TYPE),
            new Pair<>("idToken", TOKEN),
            new Pair<>("tokenType", TYPE)
        );
    }

    @Override
    protected Class<LoginRequest> getTestClass() {
        return LoginRequest.class;
    }
}
