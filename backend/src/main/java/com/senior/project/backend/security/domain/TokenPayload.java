package com.senior.project.backend.security.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

/**
 * Object that represents the payload for a microsoft token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Generated
public class TokenPayload {
    private String aud;
    private String iss;
    private int iat;
    private int nbf;
    private int exp;
    private String name;
    private String nonce;
    private String oid;
    private String email;
    @JsonProperty("preferred_username") private String prefferedUsername;
    private String rh;
    private String sub;
    private String tid;
    private String uti;
    private String ver;
}
