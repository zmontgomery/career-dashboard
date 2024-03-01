package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Event;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE YEAR(e.date) = YEAR(:currentDate) AND WEEK(e.date) = WEEK(:currentDate)")
    List<Event> findEventsInCurrentWeek(@Param("currentDate") LocalDate currentDate);

    @Modifying
    @Transactional
    @Query("UPDATE Event e SET e.imageId = :imageId WHERE e.id = :eventId")
    void updateImageIdById(@Param("imageId") Long imageId, @Param("eventId") Long eventId);

}
