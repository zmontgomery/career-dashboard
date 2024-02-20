package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.TaskType;

import java.util.Map;

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
    public Flux<Task> all() {
        return Flux.fromIterable(taskRepository.findAll());
    }
/*     public Flux<Task> dashboard() {
        return Flux.fromIterable(taskRepository.findAll()); //same as /tasks for now
    } */

    //public Mono<Task> newTask(@RequestBody Task newTask) {
    //    return taskRepository.save(newTask);
    //}


    @Transactional
    public Mono<Task> updateTask(long id, Map<String, Object> updates) {
        Task existingTask = taskRepository.findById(id);

        if (updates.containsKey("description")) {
            existingTask.description = (String) updates.get("description");
        }
        if (updates.containsKey("taskType")) {
            if (updates.get("taskType").equals("artifact") &&
                    updates.containsKey("artifactName")) {
                // don't edit the task type unless an artifact name was given
                existingTask.setTaskType(TaskType.valueOf((String) updates.get("taskType")));
                existingTask.setEvent(null);
            }
            else if (updates.get("taskType").equals("event") &&
                    updates.containsKey("event")) {
                existingTask.setTaskType(TaskType.valueOf((String) updates.get("taskType")));
                existingTask.setArtifactName(null);
            }
        }
        if (updates.containsKey("artifactName") && existingTask.getTaskType() == TaskType.ARTIFACT) {
            existingTask.setArtifactName((String) updates.get("artifactName"));
        }
        if (updates.containsKey("event") && existingTask.getTaskType().equals("event")) {
            Event assignedEvent = eventRepository.findById(Integer.parseInt((String) updates.get("event")));
            existingTask.setEvent(assignedEvent);
        }

        return Mono.just(taskRepository.save(existingTask));
    }

    public Mono<Task> findById(int id) {
        Task task = taskRepository.findById((long) id);
        return task == null ? Mono.empty() : Mono.just(task);
    }
    
}
