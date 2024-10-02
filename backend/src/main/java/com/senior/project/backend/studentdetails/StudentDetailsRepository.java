package com.senior.project.backend.studentdetails;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senior.project.backend.domain.StudentDetails;

public interface StudentDetailsRepository extends JpaRepository<StudentDetails, UUID> {
}
