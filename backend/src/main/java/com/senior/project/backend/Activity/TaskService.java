package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.TaskType;
import com.senior.project.backend.domain.YearLevel;

import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
     * Gets the specific tasks to display on the dashboard (unimplemented)
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
    @SuppressWarnings("unlikely-arg-type")  // it yells because it thinks "event" is unlikely for task type
    @Transactional
    public Mono<Task> updateTask(long id, Map<String, Object> updates) {
        Task existingTask = taskRepository.findById(id);

        if (updates.containsKey("description")) {
            existingTask.description = (String) updates.get("description");
        }

        // updates technically should always have the task type
        if (updates.containsKey("taskType")) {
            // can't set the task type to artifact without providing an artifact name
            if (updates.get("taskType").equals("artifact") &&
                    updates.containsKey("artifactName")) {
                existingTask.setTaskType(TaskType.valueOf((String) updates.get("taskType")));
                existingTask.setEvent(null);    // if task was previously an event task, remove the event
            }
            // can't set the task type to event without providing an event
            else if (updates.get("taskType").equals("event") &&
                    updates.containsKey("event")) {
                existingTask.setTaskType(TaskType.valueOf((String) updates.get("taskType")));
                existingTask.setArtifactName(null); // if the task was previously an artifact task, remove the artifact
            }
        }

        // this is done in a separate step from the task type in case the type doesn't change
        if (updates.containsKey("artifactName") && existingTask.getTaskType() == TaskType.ARTIFACT) {
            existingTask.setArtifactName((String) updates.get("artifactName"));
        }
        // does not throw an event not found exception but still handles null events
        if (updates.containsKey("event") && existingTask.getTaskType().equals("event")) {
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

        if (data.containsKey("description")) {
            newTask.description = (String) data.get("description");
        }

        if (data.get("taskType").equals("artifact")) {
            newTask.setTaskType(TaskType.valueOf((String) data.get("taskType")));
            newTask.setArtifactName((String) data.get("artifactName"));
            newTask.setEvent(null);
        }
        // does not throw an event not found exception but still handles null events
        else if (data.get("taskType").equals("event")) {
            newTask.setTaskType(TaskType.valueOf((String) data.get("taskType")));
            Optional<Event> assignedEvent = eventRepository.findById((long) Integer.parseInt((String) data.get("event")));
            assignedEvent.ifPresent(newTask::setEvent);
            newTask.setArtifactName(null);
        }

        return Mono.just(taskRepository.save(newTask));
    }

    
}
