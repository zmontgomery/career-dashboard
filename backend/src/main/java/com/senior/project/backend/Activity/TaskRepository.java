package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Task;

import java.util.List;
import java.util.UUID;

import com.senior.project.backend.domain.User;
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

    @Query("SELECT t FROM Task t " +
            "WHERE t.yearLevel IN :yList " +
            "AND NOT EXISTS (SELECT s FROM Submission s " +
            "WHERE s.studentId = :uid " +
            "AND s.taskId = t.id)")
    List<Task> findOverDueTasks(@Param("y") List<YearLevel> yearLevel, @Param("uid") UUID userId);
}
