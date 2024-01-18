package com.senior.project.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.Generated;

import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Generated
public abstract class User {
	@Id
	private Long id;
	
	private String email;
	private int phoneNumber;
	private Date dateCreated;
	private Date lastLogin;
	private String firstName;
	private String lastName;
	private boolean canEmail;
	private boolean canText;
}
