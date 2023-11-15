package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Artifact {

    private int id;

	private String name;
	private String fileLocation;
	private String comment;
}
