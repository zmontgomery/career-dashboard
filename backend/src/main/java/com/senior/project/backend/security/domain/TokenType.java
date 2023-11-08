package com.senior.project.backend.security.domain;

/**
 * Enum for the source of a token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public enum TokenType {
    GOOGLE, 
    MICROSOFT_ENTRA_ID,
    DEFAULT // For test
}
