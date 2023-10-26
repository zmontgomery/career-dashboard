package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    private String id;
    
    private Boolean isRecurring;
    private String organizer;
    private String location;
    private Boolean isRequired;
    private String name;
    private String description;
    private Date date;

}
