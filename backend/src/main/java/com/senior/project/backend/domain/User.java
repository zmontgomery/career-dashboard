package com.senior.project.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Data
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Generated
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails {
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
	private String preferredName;
	private boolean canEmail;
	private boolean canText;
	private boolean signedUp;
	@Enumerated(EnumType.STRING)
	private Role role;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="student_details_id")
	@Nullable
	private StudentDetails studentDetails;

	@JsonIgnore
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> authorities = new LinkedList<>();
		if (isStudent() && studentDetails != null) authorities.add(new SimpleGrantedAuthority(Role.Student.toString()));
		if (hasAdminPrivileges()) authorities.add(new SimpleGrantedAuthority(Role.Admin.toString()));
		if (hasFacultyPrivileges()) authorities.add(new SimpleGrantedAuthority(Role.Faculty.toString()));
		if (hasSuperAdminPrivileges()) authorities.add(new SimpleGrantedAuthority(Role.SuperAdmin.toString()));
 		return authorities;
	}

	@JsonIgnore
	@Override
	public String getPassword() {
		return "";
	}

	@Override
	public String getUsername() {
		return email;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	@JsonIgnore
	@Override
	public boolean isEnabled() {
		return true;
	}

	@JsonIgnore
	public boolean isStudent() {
		return this.role == Role.Student;
	}

	@JsonIgnore
	public boolean isFaculty() {
		return this.role == Role.Faculty;
	}

	@JsonIgnore
	public boolean isAdmin() {
		return this.role == Role.Admin;
	}

	@JsonIgnore
	public boolean isSuperAdmin() {
		return this.role == Role.SuperAdmin;
	}

	@JsonIgnore
	public boolean hasFacultyPrivileges() {
		return this.role == Role.Faculty || this.hasAdminPrivileges();
	}

	@JsonIgnore
	public boolean hasAdminPrivileges() {
		return this.role == Role.Admin || this.hasSuperAdminPrivileges();
	}

	@JsonIgnore
	public boolean hasSuperAdminPrivileges() {
		return this.role == Role.SuperAdmin;
	}

}
