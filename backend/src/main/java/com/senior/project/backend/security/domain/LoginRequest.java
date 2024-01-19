package com.senior.project.backend.security.domain;

import lombok.*;

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
@Generated
public class LoginRequest {
    private String idToken;
    private TokenType type;
}
