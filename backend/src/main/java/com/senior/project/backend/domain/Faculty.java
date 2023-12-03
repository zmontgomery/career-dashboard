package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Faculty {

    private String id;
	
	private String userID;
	private boolean isAdmin;
}
