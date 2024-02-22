package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.YearLevel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, TaskRepository taskRepository) { 
        this.milestoneRepository = milestoneRepository;
        this.taskRepository = taskRepository;
    }
    
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

        @SuppressWarnings("unchecked")
        List<Integer> updatedTaskList = (ArrayList<Integer>) updates.get("tasks");
        List<Task> taskList = new ArrayList<>();

        for (Integer assignedTaskID : updatedTaskList) {
            try {
                Task assignedTask = taskRepository.findById(assignedTaskID.longValue());
                taskList.add(assignedTask);
            }
            catch (Exception e) { // task not found
                continue;
            }
        }

        List<Task> removals = new ArrayList<Task>(existingMilestone.getTasks());
        removals.removeAll(taskList);

        List<Task> additions = new ArrayList<Task>(taskList);
        additions.removeAll(existingMilestone.getTasks());
        
        for (Task removedTask : removals) {
            existingMilestone.getTasks().remove(removedTask);
            removedTask.setMilestone(null);
        }
        for (Task addedTask : additions) {
            existingMilestone.getTasks().add(addedTask);
            addedTask.setMilestone(existingMilestone);
        }

        return Mono.just(milestoneRepository.save(existingMilestone));
    }

    public Mono<Milestone> createMilestone(Map<String, Object> data) {
        Milestone newMilestone = new Milestone();

        newMilestone.setName((String) data.get("name"));
        newMilestone.setYearLevel(YearLevel.valueOf((String) data.get("yearLevel")));

        return Mono.just(milestoneRepository.save(newMilestone));
    }
}
