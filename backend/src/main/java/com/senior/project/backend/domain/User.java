package com.senior.project.backend.domain;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
@Generated
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
	private boolean canEmail;
	private boolean canText;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'getAuthorities'");
	}
	@Override
	public String getPassword() {
		return "";
	}
	@Override
	public String getUsername() {
		return email;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}
}
