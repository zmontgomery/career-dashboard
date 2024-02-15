package com.senior.project.backend.domain;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
@Getter
@Setter
@Builder
@Entity
public class Artifact {
	@Id
    private int id;
	private UUID userId;
	private String name;
	private String fileLocation;
}
