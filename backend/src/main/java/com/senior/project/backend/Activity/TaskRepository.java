package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Task;

import java.util.List;
import java.util.UUID;

import com.senior.project.backend.domain.YearLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for Tasks
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // additional query methods if needed
    // possibly join with events
    @Query("SELECT t FROM Task t")
    List<Task> findAll();

    Task findById(long id);

    /**
     * Find Tasks the User has not Completed
     * @param yearLevels yearLevels to Search for. Use to grab find overdue tasks or upcoming tasks
     * @param userId ID of the User to search for Submissions to the tasks
     * @param limit limit of tasks to return
     * @return List of Tasks
     */
    @Query(value = "SELECT t FROM Task t " +
            "WHERE t.yearLevel IN :yList " +
            "AND NOT EXISTS (SELECT s FROM Submission s " +
            "WHERE s.studentId = :uid " +
            "AND s.taskId = t.id) " +
            "ORDER BY CASE t.yearLevel " +
            "WHEN 'FRESHMAN' THEN 0 " +
            "WHEN 'SOPHOMORE' THEN 1 " +
            "WHEN 'JUNIOR' THEN 2 " +
            "WHEN 'SENIOR' THEN 3 " +
            "ELSE 4 END ASC " +
            "LIMIT :lim ")
    List<Task> findTasksToDisplayOnDashboard(@Param("yList") List<YearLevel> yearLevels, @Param("uid") UUID userId, @Param("lim") Integer limit);
}
