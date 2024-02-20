package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // additional query methods if needed

    Event findById(long id);

    @Query("SELECT e FROM Event e WHERE YEAR(e.date) = YEAR(:currentDate) AND WEEK(e.date) = WEEK(:currentDate)")
    List<Event> findEventsInCurrentWeek(@Param("currentDate") LocalDate currentDate);
}
