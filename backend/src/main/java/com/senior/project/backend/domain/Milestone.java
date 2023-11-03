package com.senior.project.backend.domain;

import lombok.*;

import java.util.List;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Milestone {
    private String milestoneID;
    private String name;
    private List<Task> tasks;
    private List<Event> events;
    private boolean isActive;
    private YearLevel yearLevel;
}


