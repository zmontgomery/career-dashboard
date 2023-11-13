package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    // additional query methods if needed
}
