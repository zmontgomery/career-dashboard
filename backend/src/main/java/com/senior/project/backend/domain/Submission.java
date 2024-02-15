package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

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
    private int artifactId;
    private UUID studentId;
	private Date submissionDate;
	private String comment;

    public void from(Submission submission) {
        this.id = submission.id;
        this.taskId = submission.taskId;
        this.artifactId = submission.artifactId;
        this.studentId = submission.studentId;
        this.submissionDate = submission.submissionDate;
        this.comment = submission.comment;
    }
}
