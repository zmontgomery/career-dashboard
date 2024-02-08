package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    // additional query methods if needed

    @Query("SELECT m FROM Milestone m LEFT JOIN FETCH m.tasks")
    List<Milestone> findAllWithTasks();

    Milestone findById(long id);
}
