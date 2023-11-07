package com.senior.project.backend.security.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
public class LoginResponse {
    private String token;
    private TempUser user;
}
