package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Submission {
	
    private int id;
	
	private int assignmentID;
	private int artifactID;
	private Date submissionDate;
}
