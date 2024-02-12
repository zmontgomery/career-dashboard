package com.senior.project.backend.notification;

import com.senior.project.backend.Activity.EventRepository;
import com.senior.project.backend.Constants;
import com.senior.project.backend.users.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @InjectMocks
    NotificationService notificationService;

    @Mock
    EventRepository eventRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    EmailService emailService;

    @Test
    public void testWeeklyNotifications() {
        when(userRepository.findUsersByCanEmailIsTrue()).thenReturn(Constants.USERS);
        when(userRepository.findUsersByCanTextIsTrue()).thenReturn(Constants.USERS);
        when(eventRepository.findEventsInCurrentWeek(any())).thenReturn(Constants.EVENT_LIST);
        notificationService.weeklyNotifications();
        verify(emailService, times(Constants.USERS.size())).sendWeeklyEventUpdates(any(), any(), any());
    }
}
