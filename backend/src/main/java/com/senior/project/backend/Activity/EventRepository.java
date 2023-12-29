package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // additional query methods if needed
}
