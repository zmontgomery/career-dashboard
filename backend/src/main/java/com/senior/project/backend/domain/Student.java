package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
@PrimaryKeyJoinColumn(name = "id")
public class Student extends User {
	
	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID studentId;
	
	private int universityID;
	private double gpa;
	private String description;
	private String yearLevel;

	@Temporal(value = TemporalType.DATE)
	private Date graduationYear;

	@Temporal(value = TemporalType.TIMESTAMP)
	private Date startDate;

	private Project[] projects;
	private Job[] jobs;
	private DegreeProgram[] minors;
	private DegreeProgram[] majors;
	private Club[] clubs;
	private Skill[] skills;
	private Skill[] languages;
}