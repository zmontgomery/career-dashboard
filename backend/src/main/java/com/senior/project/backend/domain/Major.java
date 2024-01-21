package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Major {

    private int majorID;
	
	private String name;
	private String abbreviation;
	private int departmentID;
}
