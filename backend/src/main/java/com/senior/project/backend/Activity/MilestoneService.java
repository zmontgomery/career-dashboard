package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;

    public MilestoneService(MilestoneRepository milestoneRepository) { this.milestoneRepository = milestoneRepository;}
    public Flux<Milestone> all() {
        return milestoneRepository.all();
    }
}
