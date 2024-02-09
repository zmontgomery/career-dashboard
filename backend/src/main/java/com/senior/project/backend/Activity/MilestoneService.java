package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.YearLevel;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final Logger logger = LoggerFactory.getLogger(MilestoneService.class);

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

    public Mono<Milestone> createMilestone(Map<String, Object> data) {
        Milestone newMilestone = new Milestone();

        newMilestone.setName((String) data.get("name"));
        newMilestone.setYearLevel(YearLevel.valueOf((String) data.get("yearLevel")));

        if (data.containsKey("description")) {
            newMilestone.setDescription((String) data.get("description"));
        }
        //TODO: assign tasks to milestones

        return Mono.just(milestoneRepository.save(newMilestone));
    }
}
