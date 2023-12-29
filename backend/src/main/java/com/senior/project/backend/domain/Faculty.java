package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Faculty {

    private String id;
	
	private String userID;
	private boolean isAdmin;
}
