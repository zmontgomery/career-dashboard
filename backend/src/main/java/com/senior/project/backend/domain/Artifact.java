package com.senior.project.backend.domain;

import java.util.UUID;

import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
	/** Exists if artifact is submission or profile picture
	 * */
	@Nullable
	private UUID userId;
	private String name;
	private String fileLocation;
	@Enumerated(EnumType.STRING)
	private ArtifactType type;
}

