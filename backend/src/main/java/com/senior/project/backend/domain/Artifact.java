package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class Artifact {

    private int id;

	private String name;
	private String fileLocation;
	private String comment;
}
