package com.senior.project.backend.security.domain;

import com.senior.project.backend.domain.User;

import lombok.*;

/**
 * A domain object representing the response gotten from a 
 * request to log in
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class LoginResponse {
    private String token;
    private User user;
}
