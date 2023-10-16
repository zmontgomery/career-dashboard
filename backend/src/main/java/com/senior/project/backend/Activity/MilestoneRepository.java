package com.senior.project.backend.Activity;
import com.senior.project.backend.domain.Milestone;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Repository
public class MilestoneRepository {

    private static final List<Milestone> DATA = new ArrayList<>();

    static {
        DATA.add(Milestone.builder().milestoneID("milestone 1")
                .activityID("activity 1")
                .isActive(false).build());
        DATA.add(Milestone.builder().milestoneID("milestone 2")
                .activityID("activity 2")
                .isActive(false).build());
    }

    public Flux<Milestone> all() {
        return Flux.fromIterable(DATA);
    }
}
