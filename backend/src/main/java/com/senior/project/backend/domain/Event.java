package com.senior.project.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    @Id
    private Long id;
    private Boolean isRequired;
    private String name;
    private String description;
    private Date date;

}
