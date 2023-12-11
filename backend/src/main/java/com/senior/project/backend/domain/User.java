package com.senior.project.backend.domain;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Data
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
	
	private String email;
	private String phoneNumber;

	@Temporal(value = TemporalType.TIMESTAMP)
	private Date dateCreated;

	@Temporal(value = TemporalType.TIMESTAMP)
	private Date lastLogin;
	private String firstName;
	private String lastName;
	private boolean canEmail;
	private boolean canText;
}
