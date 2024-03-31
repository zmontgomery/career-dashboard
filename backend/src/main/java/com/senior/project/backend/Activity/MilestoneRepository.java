package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Milestones
 */
@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    // additional query methods if needed

    @Query("SELECT m FROM Milestone m LEFT JOIN FETCH m.tasks")
    List<Milestone> findAllWithTasks();

    Milestone findById(long id);


    // FIXME this query is slightly incorrect because it does not account for submissions objects that exist but their artifact was deleted
    @Query("SELECT DISTINCT m FROM Milestone m " +
            "JOIN FETCH m.tasks t " +
            "WHERE (SELECT COUNT(*) FROM Task t2 WHERE t2.milestone.id = m.id) = " +
            "(SELECT COUNT(*) FROM Submission s JOIN Task t3 ON s.taskId = t3.id  JOIN Artifact a ON s.artifactId = a.id WHERE t3.milestone.id = m.id AND s.studentId = :uid)")
    List<Milestone> findComplete(@Param("uid") UUID userId);

}
