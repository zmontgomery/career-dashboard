package com.senior.project.backend.security;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.senior.project.backend.security.domain.Session;

/**
 * Repository that holds Session information
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Repository
public interface AuthRepository extends JpaRepository<Session, UUID>{
    // Add methods when needed
    @Query("SELECT s FROM Session s WHERE s.email = :email")
    Optional<Session> findSessionByEmail(@Param("email") String email);
}
