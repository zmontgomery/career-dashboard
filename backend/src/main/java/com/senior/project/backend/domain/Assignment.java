package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    private int id;

	private int studentID;
	private int activityID;
}
