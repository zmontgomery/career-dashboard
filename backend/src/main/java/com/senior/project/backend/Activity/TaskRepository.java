package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // additional query methods if needed
    // possibly join with events
    @Query("SELECT t FROM Task t")
    List<Task> findAll();

    Task findById(long id);
}
