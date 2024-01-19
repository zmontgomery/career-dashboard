package com.senior.project.backend.users;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senior.project.backend.domain.User;

/**
 * Repostory that interacts the the `user` table in the database
 * 
 * @author Jim Logan - jrl9984@rit.edu
 */
public interface UserRepository extends JpaRepository<User, UUID> { }
