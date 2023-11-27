package com.senior.project.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Artifact {

	@Id
    private int id;

	private String name;
	private String fileLocation;
	private String comment;
}
