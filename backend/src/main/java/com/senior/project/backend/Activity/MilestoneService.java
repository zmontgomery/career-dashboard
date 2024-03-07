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
    
    /**
     * Gets all milestones without tasks
     */
    public Flux<Milestone> all() {
        return Flux.fromIterable(milestoneRepository.findAll());
    }

    /**
     * Gets all milestones with tasks
     */
    public Flux<Milestone> allWithTasks() {
        return Flux.fromIterable(milestoneRepository.findAllWithTasks());
    }

    /**
     * Updates a milestone using the provided map of updates
     * It assumes there will always be a task array sent
     * 
     * @param id milestone id
     * @param updates updated milestone data in the form of fieldName, fieldValue
     * @return the updated milestone
     * @throws Exception if a task in the task list is not found
     */
    @Transactional
    public Mono<Milestone> updateMilestone(long id, Map<String, Object> updates) {
        Milestone existingMilestone = milestoneRepository.findById(id);

        if (updates.containsKey("description")) {
            existingMilestone.setDescription((String) updates.get("description"));
        }

        // otherwise has a warning about parsing a list from a generic object
        @SuppressWarnings("unchecked")
        List<Integer> updatedTaskList = (ArrayList<Integer>) updates.get("tasks");
        List<Task> taskList = new ArrayList<>();

        // gets the list of task objects from the provided list of task IDs
        for (Integer assignedTaskID : updatedTaskList) {
            try {
                Task assignedTask = taskRepository.findById(assignedTaskID.longValue());
                taskList.add(assignedTask);
            }
            catch (Exception e) { // task not found
                continue;
            }
        }

        // if a task exists on the milestone but is not included in the task list, remove it
        List<Task> removals = new ArrayList<Task>(existingMilestone.getTasks());
        removals.removeAll(taskList);

        // if a task in the task list is not on the milestone, add it
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

    /**
     * Creates a new milestone
     * A milestone is initially created with just a name and yearLevel which cannot be changed
     * All other data is added/updated in a different step
     * 
     * @param data milestone data in the form of fieldName, fieldValue
     * @return the new milestone
     */
    public Mono<Milestone> createMilestone(Map<String, Object> data) {
        Milestone newMilestone = new Milestone();

        newMilestone.setName((String) data.get("name"));
        newMilestone.setYearLevel(YearLevel.valueOf((String) data.get("yearLevel")));

        return Mono.just(milestoneRepository.save(newMilestone));
    }
}
