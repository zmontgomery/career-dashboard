package com.senior.project.backend.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

// TODO remove this later, here for initial testing
@RestController
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("api/send-email")
    public void sendEmail() {
        emailService.sendSimpleMessage(
                "jts7382@rit.edu",
                "Notification Service Test",
                "Test of notification service."
        );
    }
}
