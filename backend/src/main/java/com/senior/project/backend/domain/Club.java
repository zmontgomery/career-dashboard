package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID clubId;

    private UUID clubName;

    @Temporal(value = TemporalType.TIMESTAMP)
    private Date startDate;

    @Temporal(value = TemporalType.TIMESTAMP)
    private Date endDate;
}
