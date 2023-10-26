package com.senior.project.backend.security.domain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import lombok.Getter;

@PropertySource("classpath:application.properties")
@Component
@Getter
public class MicrosoftAuthInformation {
    @Value("${security.ms.clientID}")
    private String clientId;

     @Value("${security.ms.tenantID}")
    private String tenantId;
}
