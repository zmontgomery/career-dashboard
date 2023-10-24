package com.senior.project.backend.security.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String accessToken;
    private String idToken;
    private TokenType type;
}
