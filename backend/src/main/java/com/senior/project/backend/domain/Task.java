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
    private String description;
    private Boolean isRequired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn()
    private Milestone milestone;
}
