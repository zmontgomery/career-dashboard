package com.senior.project.backend.security.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Domain object that represents a request to login
 * has an id token for user identification and
 * a token type to help determine where the token was from
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String idToken;
    private TokenType tokenType;
}
