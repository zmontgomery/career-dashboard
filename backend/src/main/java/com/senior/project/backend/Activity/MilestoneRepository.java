package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Milestone;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class MilestoneRepository {

    private static final List<Milestone> DATA = new ArrayList<>();

    static {
        Milestone m1 = Milestone.builder().milestoneID("milestone 1")
                .activityID("activity 1")
                .isActive(false).build();
        m1.setDescription("milestone 1 description");
        m1.setNeedsArtifact(true);
        m1.setDate(new Date());
        DATA.add(m1);
        Milestone m2 = Milestone.builder().milestoneID("milestone 2")
                .activityID("activity 2")
                .isActive(false).build();
        m2.setDescription("milestone 2 description");
        m2.setNeedsArtifact(true);
        m2.setDate(new Date());
        DATA.add(m2);
    }

    public Flux<Milestone> all() {
        return Flux.fromIterable(DATA);
    }
}
