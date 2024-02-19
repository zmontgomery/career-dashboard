package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;

    public MilestoneService(MilestoneRepository milestoneRepository) { this.milestoneRepository = milestoneRepository;}
    public Flux<Milestone> all() {
        return Flux.fromIterable(milestoneRepository.findAll());
    }

    public Flux<Milestone> allWithTasks() {
        return Flux.fromIterable(milestoneRepository.findAllWithTasks());
    }

    @Transactional
    public Mono<Milestone> updateMilestone(long id, Map<String, Object> updates) {
        Milestone existingMilestone = milestoneRepository.findById(id);

        if (updates.containsKey("description")) {
            existingMilestone.setDescription((String) updates.get("description"));
        }
        //TODO: assign tasks to milestones

        return Mono.just(milestoneRepository.save(existingMilestone));
    }
}
