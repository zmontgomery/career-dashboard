package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;

    @Temporal(value = TemporalType.DATE)
    private Date startDate;

    @Temporal(value = TemporalType.DATE)
    private Date endDate;

    @ManyToOne
    @JoinColumn(name="student_details_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID studentDetailsID;

    // @ManyToOne(fetch = FetchType.EAGER)
    // @JoinColumn(name="student_details_id")
    // private StudentDetails studentDetails;
}
