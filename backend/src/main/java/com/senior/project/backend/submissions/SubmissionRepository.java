package com.senior.project.backend.submissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.senior.project.backend.domain.Submission;

import java.util.List;
import java.util.Date;
import java.util.UUID;
import java.util.Optional;

/**
 * Repository to interact with the submission table
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>{
    @Query("SELECT s FROM Submission s WHERE s.submissionDate < :now AND s.studentId = :userId AND s.taskId = :taskId")
    List<Submission> findAllBeforeNowWithUserAndTask(
        @Param("now") Date now, 
        @Param("userId") UUID userId, 
        @Param("taskId") int taskId
    );

    @Query("SELECT s FROM Submission s WHERE s.studentId = :userId")
    List<Submission> findAllWithUser(
        @Param("userId") UUID userId
    );

    @Query("SELECT s FROM Submission s WHERE s.artifactId = :artifactId")
    Optional<Submission> findSubmissionByArtifactId(@Param("artifactId") int artifactId);
}
