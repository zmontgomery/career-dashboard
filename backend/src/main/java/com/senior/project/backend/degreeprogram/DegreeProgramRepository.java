package com.senior.project.backend.degreeprogram;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senior.project.backend.domain.DegreeProgram;

public interface DegreeProgramRepository extends JpaRepository<DegreeProgram, UUID> {
}
