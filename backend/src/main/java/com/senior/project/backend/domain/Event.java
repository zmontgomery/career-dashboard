package com.senior.project.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class Event {
    @Id
    private Long id;
    private Boolean isRequired;
    private String name;
    private String description;
    private Date date;

}
