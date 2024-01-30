package com.senior.project.backend.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.util.Properties;

@PropertySource("classpath:application.properties")
@Component
public class EmailService {

    // TODO set the rest of these with application properties/environment variables
    private String host = "smtp.gmail.com";
    private int port = 587;
    private String username = "partiallyhydrateddevs@gmail.com";

    @Value("${spring.mail.host}")
    private String password;
    private String smtpAuth = "true";
    private String tls = "true";

    private final JavaMailSender emailSender;

    public EmailService() {
        this.emailSender = javaMailSender();
        System.out.println("email service: "+password);
        System.out.println(new EmailInformation().getPassword());
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(username);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    private JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);

        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", smtpAuth);
        props.put("mail.smtp.starttls.enable", tls);

//        props.put("mail.debug", "true");

        return mailSender;
    }
}

