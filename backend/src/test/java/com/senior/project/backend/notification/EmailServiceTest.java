package com.senior.project.backend.notification;

import com.senior.project.backend.Constants;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Properties;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @InjectMocks
    private EmailService emailService;

    @Mock
    JavaMailSenderImpl javaMailSender;

    @Mock
    MimeMessage mimeMessage;

    @Mock
    TemplateEngine templateEngine;

    @Mock
    Properties props;

    @Test
    public void testSendMessage() {
        emailService = Mockito.spy(emailService);
        ReflectionTestUtils.setField(emailService, "emailSender", javaMailSender);
        emailService.sendSimpleMessage("username", "subject", "text");
        verify(javaMailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    public void testPostConstructor() {
        try(MockedConstruction<JavaMailSenderImpl> mockedConstruction = Mockito.mockConstruction(JavaMailSenderImpl.class,
                (mock, context)-> when(mock.getJavaMailProperties()).thenReturn(props))) {
            ReflectionTestUtils.invokeMethod(emailService, "initEmailInfo");
            assertEquals(1,mockedConstruction.constructed().size());
        }
    }

    @Test
    public void testSendWeeklyEventUpdates() {
        emailService = Mockito.spy(emailService);
        ReflectionTestUtils.setField(emailService, "emailSender", javaMailSender);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("emailTemplate"), any())).thenReturn("Content");
        emailService.sendWeeklyEventUpdates(Constants.user1, LocalDate.now(), Constants.EVENT_LIST);
        verify(templateEngine, times(1)).process(eq("emailTemplate"), any());
        verify(javaMailSender, times(1)).createMimeMessage();
    }

}
