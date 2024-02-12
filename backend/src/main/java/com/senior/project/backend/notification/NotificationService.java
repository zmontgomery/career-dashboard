package com.senior.project.backend.notification;

import com.senior.project.backend.Activity.EventRepository;
import com.senior.project.backend.domain.Event;
import com.senior.project.backend.users.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    private final EmailService emailService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public NotificationService(
            EmailService emailService,
            EventRepository eventRepository,
            UserRepository userRepository
    ) {
        this.emailService = emailService;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 */1 * * * *")
//    @Scheduled(cron = "0 0 0 * * MON")
    public void myTaskMethod() {
        // Your task logic here
        System.out.println("Task executed on every Monday");


        LocalDate currentDate = LocalDate.now();
        List<Event> events = this.eventRepository.findEventsInCurrentWeek(currentDate);

        userRepository.findUsersByCanEmailIsTrue().forEach((user -> this.emailService.sendWeeklyEventUpdates(user,
                currentDate,
                events
        )
        ));

        userRepository.findUsersByCanTextIsTrue().forEach(user -> {
            // TODO replace with real SMS service
            System.out.println("sending sms to " + user.getPhoneNumber());
        });
    }
}
