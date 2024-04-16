package com.senior.project.backend.Activity;

import com.senior.project.backend.util.NonBlockingExecutor;
import com.senior.project.backend.domain.Milestone;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.YearLevel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.users.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final CurrentUserUtil currentUserUtil;

    public MilestoneService(MilestoneRepository milestoneRepository, TaskRepository taskRepository,
                            UserService userService, CurrentUserUtil currentUserUtil) {
        this.milestoneRepository = milestoneRepository;
        this.taskRepository = taskRepository;
        this.userService = userService;
        this.currentUserUtil = currentUserUtil;
    }
    
    /**
     * Gets all milestones without tasks
     */
    public Flux<Milestone> all() {
        return NonBlockingExecutor.executeMany(milestoneRepository::findAll);
    }

    /**
     * Gets all milestones with tasks
     */
    public Flux<Milestone> allWithTasks() {
        return NonBlockingExecutor.executeMany(milestoneRepository::findAllWithTasks);
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
            Task assignedTask = taskRepository.findById(assignedTaskID.longValue());
            if (assignedTask != null) {
                taskList.add(assignedTask);
            } 
        }

        // if a task exists on the milestone but is not included in the task list, remove it
        List<Task> removals = new ArrayList<>(existingMilestone.getTasks());
        removals.removeAll(taskList);

        // if a task in the task list is not on the milestone, add it
        List<Task> additions = new ArrayList<>(taskList);
        additions.removeAll(existingMilestone.getTasks());
        
        for (Task removedTask : removals) {
            existingMilestone.getTasks().remove(removedTask);
            removedTask.setMilestone(null);
        }
        for (Task addedTask : additions) {
            existingMilestone.getTasks().add(addedTask);
            addedTask.setMilestone(existingMilestone);
        }

        return NonBlockingExecutor.execute(()->milestoneRepository.save(existingMilestone));
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

        return NonBlockingExecutor.execute(()->milestoneRepository.save(newMilestone));
    }

    /**
     * Retrieves a list of completed milestones for a requested user to display on portfolio
     * This can either be for a student viewing their own portfolio, or a faculty viewing
     * a student's portfolio
     * 
     * @param requestedUserId UUID of the user to get the milestones for
     * @return the list of milestones, or 403 forbidden if a student requests another student
     */
    public Flux<Milestone> completedMilestones(UUID requestedUserId) {
        var requestedUserMono = userService.findById(requestedUserId)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "No user with id: " + requestedUserId + " found")));

        return Mono.zip(requestedUserMono, currentUserUtil.getCurrentUser())
                .flatMap((users) -> {
                    User requestedUser = users.getT1();
                    User currentUser = users.getT2();
                    if (currentUser.hasFacultyPrivileges()) {
                        return Mono.empty();
                    }

                    if (currentUser.getId().equals(requestedUserId)) {
                        return Mono.empty();
                    }

                    return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not have permission to view milestones of user with id: " + requestedUser));
                })
                .thenMany(NonBlockingExecutor.executeMany(() -> milestoneRepository.findComplete(requestedUserId)));
    }
}
