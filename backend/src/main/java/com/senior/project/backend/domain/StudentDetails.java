package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.List;

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
	@GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

	private int universityId;
	private double gpa;
	private String description;

	@Enumerated(EnumType.STRING)
	private YearLevel yearLevel;

	@Temporal(value = TemporalType.DATE)
	private Date graduationYear;

	@Temporal(value = TemporalType.TIMESTAMP)
	private Date startDate;

	@OneToMany(mappedBy = "studentDetails", fetch = FetchType.EAGER)
	private List<Project> projects;

	@OneToMany(mappedBy = "studentDetails", fetch = FetchType.EAGER)
	private List<Job> jobs;
	
	@OneToMany(mappedBy = "studentDetails", fetch = FetchType.EAGER)
	private List<DegreeProgram> degreePrograms;
	// private DegreeProgram[] majors;
	// private Club[] clubs;

	@OneToMany(mappedBy = "studentDetails", fetch = FetchType.EAGER)
	private List<Skill> skills;
	// private Skill[] languages;
}