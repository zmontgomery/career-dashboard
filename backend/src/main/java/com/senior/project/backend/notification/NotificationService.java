package com.senior.project.backend.notification;

import com.senior.project.backend.Activity.EventRepository;
import com.senior.project.backend.domain.Event;
import com.senior.project.backend.users.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    private final EmailService emailService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final Logger logger;

    public NotificationService(
            EmailService emailService,
            EventRepository eventRepository,
            UserRepository userRepository
    ) {
        this.emailService = emailService;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.logger = LoggerFactory.getLogger(NotificationService.class);
    }

//    For Testing this will send every minute instead. replace 1 with 5 for every 5 minutes etc.
//    @Scheduled(cron = "0 */1 * * * *")
    @Scheduled(cron = "0 0 0 * * MON")
    public void weeklyNotifications() {
        LocalDate currentDate = LocalDate.now();
        List<Event> events = this.eventRepository.findEventsInCurrentWeek(currentDate);

        if (events.isEmpty()) {
            logger.info("No Events found");
            return;
        }

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
