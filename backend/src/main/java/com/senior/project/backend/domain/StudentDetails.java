package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@Generated
public class StudentDetails {
	@Id
    private UUID id;

	private int universityId;
	private double gpa;
	private String description;
	private String degreeLevel;

	@Temporal(value = TemporalType.DATE)
	private Date graduationYear;

	@Temporal(value = TemporalType.TIMESTAMP)
	private Date startDate;

	// private Project[] projects;
	// private Job[] jobs;
	// private DegreeProgram[] minors;
	// private DegreeProgram[] majors;
	// private Club[] clubs;
	// private Skill[] skills;
	// private Skill[] languages;
}