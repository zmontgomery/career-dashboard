package com.senior.project.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.senior.project.backend.Activity.MilestoneDTO;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @OneToMany(mappedBy = "milestone", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("milestone")
    private List<Task> tasks = null;
//    private List<Event> events;
    @Enumerated(EnumType.STRING)
    private YearLevel yearLevel;


    public MilestoneDTO toDTO() {
        return new MilestoneDTO(this.id, this.name, this.yearLevel);
    }
}


