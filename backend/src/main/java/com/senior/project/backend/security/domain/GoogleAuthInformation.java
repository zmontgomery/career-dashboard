package com.senior.project.backend.security.domain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import lombok.Getter;

@PropertySource("classpath:application.properties")
@Component
@Getter
public class GoogleAuthInformation {
    @Value("${security.google.clientID}")
    private String clientId;
}
