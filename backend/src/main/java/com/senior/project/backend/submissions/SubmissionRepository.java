package com.senior.project.backend.submissions;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.senior.project.backend.domain.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>{
    
}
