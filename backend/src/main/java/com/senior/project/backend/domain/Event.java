package com.senior.project.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Boolean isRecurring;
    private String organizer;
    private String location;
    private Boolean isRequired;
    private String name;
    private String description;
    private Date date;

}
