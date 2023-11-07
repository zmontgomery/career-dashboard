package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Event {
    @Id
    private String id;
    
    private String name;
    private String description;
    private Boolean isRecurring;
    private String organizer;
    private String location;
    private Boolean isRequired;
    private Date eventDate;

}
