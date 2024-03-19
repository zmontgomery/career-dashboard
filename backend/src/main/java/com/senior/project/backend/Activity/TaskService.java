package com.senior.project.backend.Activity;

import com.senior.project.backend.artifact.NonBlockingExecutor;
import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.TaskType;
import com.senior.project.backend.domain.YearLevel;

import java.util.*;

import com.senior.project.backend.security.SecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EventRepository eventRepository;

    public TaskService(TaskRepository taskRepository, EventRepository eventRepository) { 
        this.taskRepository = taskRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * Gets all tasks
     */
    public Flux<Task> all() {
        return Flux.fromIterable(taskRepository.findAll());
    }

    /**
     * TODO Gets the specific tasks to display on the dashboard (unimplemented)
     * A mix of incomplete and overdue tasks (probably set with a query param)
     */
    /* public Flux<Task> dashboard() {
        return Flux.fromIterable(taskRepository.findAll()); //same as /tasks for now
    } */

    /**
     * Updates a task using the provided map of updates
     * It assumes all updates will include id, name, location, and organizer since those are required
     * 
     * @param id task id
     * @param updates updated task data in the form of fieldName, fieldValue
     * @return the updated task
     */
    @Transactional
    public Mono<Task> updateTask(long id, Map<String, Object> updates) {
        Task existingTask = taskRepository.findById(id);

        existingTask.setSubmissionInstructions((String) updates.get("instructions"));

        if (updates.containsKey("description")) {
            existingTask.setDescription((String) updates.get("description"));
        }

        // updates technically should always have the task type
        if (updates.containsKey("taskType")) {
            TaskType taskType = TaskType.valueOf((String) updates.get("taskType"));
            // can't set the task type to artifact without providing an artifact name
            if (taskType.equals(TaskType.ARTIFACT) &&
                    updates.containsKey("artifactName")) {
                existingTask.setTaskType(taskType);
                existingTask.setEvent(null);    // if task was previously an event task, remove the event
            }
            // can't set the task type to event without providing an event
            else if (taskType.equals(TaskType.EVENT) &&
                    updates.containsKey("event")) {
                existingTask.setTaskType(taskType);
                existingTask.setArtifactName(null); // if the task was previously an artifact task, remove the artifact
            }

            else if (taskType.equals(TaskType.COMMENT)) {
                existingTask.setTaskType(taskType);
                existingTask.setArtifactName(null); // task previously was artifact/event, so remove that data
                existingTask.setEvent(null);
            }
        }

        // this is done in a separate step from the task type in case the type doesn't change
        if (updates.containsKey("artifactName") && existingTask.getTaskType() == TaskType.ARTIFACT) {
            existingTask.setArtifactName((String) updates.get("artifactName"));
        }
        // does not throw an event not found exception but still handles null events
        if (updates.containsKey("event") && existingTask.getTaskType().equals(TaskType.EVENT)) {
            Optional<Event> assignedEvent = eventRepository.findById(Long.valueOf(Integer.parseInt((String) updates.get("event"))));
            assignedEvent.ifPresent(existingTask::setEvent);
        }

        return Mono.just(taskRepository.save(existingTask));
    }

    /**
     * Gets a specific task by ID
     * 
     * @return task object
     */
    public Mono<Task> findById(int id) {
        Task task = taskRepository.findById((long) id);
        return task == null ? Mono.empty() : Mono.just(task);
    }
    

    /**
     * Create a task using the provided map of data
     * It assumes all updates will include id, name, location, and organizer since those are required
     * 
     * @param data task data in the form of fieldName, fieldValue
     * @return the new task
     */
    @Transactional
    public Mono<Task> createTask(Map<String, Object> data) {
        Task newTask = new Task();

        newTask.setName((String) data.get("name"));
        newTask.setYearLevel(YearLevel.valueOf((String) data.get("yearLevel")));
        newTask.setSubmissionInstructions((String) data.get("instructions"));

        if (data.containsKey("description")) {
            newTask.setDescription((String) data.get("description"));
        }

        TaskType taskType = TaskType.valueOf((String) data.get("taskType"));

        if (taskType.equals(TaskType.ARTIFACT)) {
            newTask.setTaskType(taskType);
            newTask.setArtifactName((String) data.get("artifactName"));
            newTask.setEvent(null);
        }
        // does not throw an event not found exception but still handles null events
        else if (taskType.equals(TaskType.EVENT)) {
            newTask.setTaskType(taskType);
            Optional<Event> assignedEvent = eventRepository.findById((long) Integer.parseInt((String) data.get("event")));
            assignedEvent.ifPresent(newTask::setEvent);
            newTask.setArtifactName(null);
        }

        else if (taskType.equals(TaskType.COMMENT)) {
            newTask.setTaskType(taskType);
            newTask.setArtifactName(null);
            newTask.setEvent(null);
        }

        return Mono.just(taskRepository.save(newTask));
    }


    public Flux<Task> dashboard(int limit) {
        return SecurityUtil.getCurrentUser()
                .flatMapMany((user) -> {
                    var studentDetails = user.getStudentDetails();
                    if (studentDetails == null) {
                        return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Student Details not setup for user"));
                    }
                    return NonBlockingExecutor.executeMany(() -> {
                        int overdueLimit = limit / 2;
                        int upcomingLimit = limit - overdueLimit;
                        var previousYears = studentDetails.getYearLevel().previousYears();
                        var upcomingYears = studentDetails.getYearLevel().currentAndUpcomingYears();
                        var overdueTasks = taskRepository.findTasksToDisplayOnDashboard(previousYears, user.getId(), overdueLimit);
                        if (overdueTasks.size() != overdueLimit) {
                            upcomingLimit = limit - overdueTasks.size();
                        }
                        var upcomingTasks = taskRepository.findTasksToDisplayOnDashboard(upcomingYears, user.getId(), upcomingLimit);
                        overdueTasks.addAll(upcomingTasks);
                        return overdueTasks;
                    });
                });
    }
}
