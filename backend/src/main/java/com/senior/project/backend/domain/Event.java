package com.senior.project.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class Event {
    @Id
    private Long id;
    private String name;
    private String description;
    private Date date;
    private String location;
    private String organizer;
    private boolean isRecurring;

    // Used in Email Template
    public String formattedDate() {
        // Format the date
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
    }
}
