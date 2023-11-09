package com.senior.project.backend.domain;

import lombok.*;

import java.util.List;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Milestone {
 
    private String id;

    private String name;
    private List<Task> tasks;
    private List<Event> events;
    private YearLevel yearLevel;
}


