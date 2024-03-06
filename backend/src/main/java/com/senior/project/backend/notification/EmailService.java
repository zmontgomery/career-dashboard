package com.senior.project.backend.notification;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.User;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.util.List;
import java.util.Properties;

@Service
public class EmailService {

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    private String smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private String tls;

    private JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    private final Logger logger;

    public EmailService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
        logger = LoggerFactory.getLogger(EmailService.class);
    }

    @PostConstruct
    private void initEmailInfo() {
        this.emailSender = javaMailSender();
    }

    /**
     * Sends a basic email containing the events of a given week
     * 
     * @param user who to send the email to
     * @param date the start date of the week
     * @param events the events to include in the email
	 * @throws MessagingException 
     */
    public void sendWeeklyEventUpdates(User user, LocalDate date, List<Event> events) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(user.getEmail());
            helper.setSubject("Week of " + date.getMonthValue() + "/" + date.getDayOfMonth() + " Events");

            // Prepare the evaluation context
            Context context = new Context();
            context.setVariable("events", events); // Set variables used in the template

            // Create the HTML body using Thymeleaf
            String htmlContent = templateEngine.process("emailTemplate", context);
            helper.setText(htmlContent, true);

            // Send email
            emailSender.send(message);

        } catch (MessagingException e) {
            logger.error(user.getEmail() + " Failed");
        }
    }

    /**
     * Basic function to send email
     * The sender is from spring.mail.username
     * 
     * @param to email recipient
     * @param subject subject line
     * @param text string containing the message body
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(username);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    /**
     * Create the emailSender object after the EmailService is created
     * The values such as host and port are from spring.mail.xxx
     * 
     * @return the mailSender object
     */
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

