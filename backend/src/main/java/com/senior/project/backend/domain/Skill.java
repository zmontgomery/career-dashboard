package com.senior.project.backend.domain;

import lombok.*;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private boolean isLanguage;

    @ManyToOne
    @JoinColumn(name="student_details_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID studentDetailsID;

    // @ManyToOne(fetch = FetchType.EAGER)
    // @JoinColumn(name="student_details_id")
    // private StudentDetails studentDetails;
}
