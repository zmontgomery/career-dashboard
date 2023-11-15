package com.senior.project.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Task {
    @Id
    private Long id;
    private String name;
    private String description;
    private Boolean isRequired;

    @ManyToOne()
    @JoinColumn()
    private Milestone milestone;
}
