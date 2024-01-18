package com.senior.project.backend.security.domain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import lombok.Getter;

/**
 * Basic object to fetch the google auth information from the
 * configuration files
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@PropertySource("classpath:application.properties")
@Component
@Getter
public class AuthInformation {
    @Value("${security.google.clientID}")
    private String gClientId;

    @Value("${security.ms.clientID}")
    private String msClientId;

    @Value("${security.ms.tenantID}")
    private String msTenantId;

    @Value("${security.signingkey}")
    private String signingKey;

    @Value("${security.tokenduration}")
    private long tokenDuration;
}
