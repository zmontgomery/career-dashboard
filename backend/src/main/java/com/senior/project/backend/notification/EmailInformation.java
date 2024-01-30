package com.senior.project.backend.notification;

import lombok.Generated;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@PropertySource("classpath:application.properties")
@Component
@Getter
@Generated
public class EmailInformation {
    @Value("${spring.mail.host}")
    private String password;
}
