package com.senior.project.backend.domain;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.*;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Generated
@PrimaryKeyJoinColumn(name = "id")
public class Faculty extends User {

	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
	
	private boolean isAdmin;
}
