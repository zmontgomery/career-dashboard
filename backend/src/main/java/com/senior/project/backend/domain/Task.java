package com.senior.project.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class Task {
    @Id
    private Long id;
    private String name;
    public String description;
    private Boolean isRequired;
    @Enumerated(EnumType.STRING)
    private YearLevel yearLevel;
    private String taskType;
    private String artifactName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn()
    private Milestone milestone;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Event event;
}
