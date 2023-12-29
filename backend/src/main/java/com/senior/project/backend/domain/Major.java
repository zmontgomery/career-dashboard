package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Major {

    private int majorID;
	
	private String name;
	private String abbreviation;
	private int departmentID;
}
