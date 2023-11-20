package com.senior.project.backend.security;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.senior.project.backend.security.domain.Session;

/**
 * Repository that holds Session information
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
@Repository
public interface AuthRepository extends JpaRepository<Session, UUID>{
    // Add methods when needed
}
