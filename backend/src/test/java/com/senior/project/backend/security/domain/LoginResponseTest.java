package com.senior.project.backend.security.domain;

import com.senior.project.backend.AbstractDomainObjectTest;
import com.senior.project.backend.Constants;
import com.senior.project.backend.Pair;
import com.senior.project.backend.domain.User;

public class LoginResponseTest extends AbstractDomainObjectTest<LoginResponse> {
    private static final User USER = Constants.user1;
    private static final String TOKEN = "token";

    public LoginResponseTest() {
        super(
            LoginResponse.builder()
                .token(TOKEN)
                .user(USER)
                .build(),
            new Pair<>("token", TOKEN),
            new Pair<>("user", USER)
        );
    }


    @Override
    protected Class<LoginResponse> getTestClass() {
        return LoginResponse.class;
    }
}
