package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Submission {
	@Id
    private int id;
    private int taskId;

	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Artifact artifact;

    private int studentId;
	private Date submissionDate;
	private String comment;
}
