package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;

import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Submission {
	
	@Id
    private int id;
	
	@OneToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Task task;

	@OneToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Artifact artifact;

	@OneToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Student student;

	private Date submissionDate;
	private String comment;
}
