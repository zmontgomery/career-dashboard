package com.senior.project.backend.domain;

import lombok.*;

import java.util.Date;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {
	
    private String id;
	
	private int userID;
	private int universityID;
	private Date graduationYear;
	private Date startDate;
}