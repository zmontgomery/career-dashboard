package com.senior.project.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("milestone")
    private List<Task> tasks;
//    private List<Event> events;
    @Enumerated(EnumType.STRING)
    private YearLevel yearLevel;
}


