package com.senior.project.backend.domain;

import lombok.*;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Milestone {
    @Id
    private String id;

    private String name;
    private List<Task> tasks;
    private List<Event> events;
    private boolean isActive;
    private YearLevel yearLevel;
}


