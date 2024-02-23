package com.senior.project.backend.domain;

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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.senior.project.backend.security.SecurityUtil;

import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

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
	private boolean isStudent;
	private boolean isAdmin;
	private boolean isFaculty;
	private boolean isSuperAdmin;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="student_details_id")
	@Nullable
	private StudentDetails studentDetails;

	@JsonIgnore
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> authorities = new LinkedList<>();
		if (isStudent && studentDetails != null) authorities.add(new SimpleGrantedAuthority(SecurityUtil.Roles.STUDENT.toString()));
		if (isAdmin) authorities.add(new SimpleGrantedAuthority(SecurityUtil.Roles.ADMIN.toString()));
		if (isFaculty) authorities.add(new SimpleGrantedAuthority(SecurityUtil.Roles.FACULTY.toString()));
		if (isSuperAdmin) authorities.add(new SimpleGrantedAuthority(SecurityUtil.Roles.SUPER_ADMIN.toString()));
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
}
