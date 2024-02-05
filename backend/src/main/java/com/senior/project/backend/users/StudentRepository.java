package com.senior.project.backend.users;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.senior.project.backend.domain.Student;

/**
 * Repostory that interacts the the `student` table in the database
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
public interface StudentRepository extends JpaRepository<Student, UUID> { 
    @Query("SELECT s FROM Student s WHERE s.email = :email")
    public Optional<Student> findStudentByEmail(@Param("email") String email);

    @Query("SELECT s FROM Student s WHERE s.universityID = :universityID")
    public Optional<Student> findStudentByUniversityId(@Param("universityID") int universityID);
}
