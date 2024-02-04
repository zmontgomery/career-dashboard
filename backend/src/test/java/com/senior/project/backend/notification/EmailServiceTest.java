package com.senior.project.backend.notification;

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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.Properties;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @InjectMocks
    private EmailService emailService;

    @Mock
    JavaMailSenderImpl javaMailSender;

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

}
