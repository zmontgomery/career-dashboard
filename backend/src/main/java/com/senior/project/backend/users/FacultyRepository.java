package com.senior.project.backend.users;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.senior.project.backend.domain.Faculty;

/**
 * Repostory that interacts the the `faculty` table in the database
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
public interface FacultyRepository extends JpaRepository<Faculty, UUID>{
    @Query("SELECT f FROM Faculty f WHERE f.email = :email")
    public Optional<Faculty> findFacultyByEmail(@Param("email") String email);
}
