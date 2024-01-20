package com.senior.project.backend.security.domain;

import com.senior.project.backend.AbstractDomainObjectTest;
import com.senior.project.backend.Pair;

public class LoginResponseTest extends AbstractDomainObjectTest<LoginResponse> {
    private static final TempUser USER = TempUser.builder().email("Email").build();
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

}
