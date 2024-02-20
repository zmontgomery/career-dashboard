package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.YearLevel;

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
                existingTask.setTaskType((String) updates.get("taskType"));
                existingTask.setEvent(null);
            }
            else if (updates.get("taskType").equals("event") &&
                    updates.containsKey("event")) {
                existingTask.setTaskType((String) updates.get("taskType"));
                existingTask.setArtifactName(null);
            }
        }
        if (updates.containsKey("artifactName") && existingTask.getTaskType().equals("artifact")) {
            existingTask.setArtifactName((String) updates.get("artifactName"));
        }
        if (updates.containsKey("event") && existingTask.getTaskType().equals("event")) {
            Event assignedEvent = eventRepository.findById(Integer.parseInt((String) updates.get("event")));
            existingTask.setEvent(assignedEvent);
        }

        return Mono.just(taskRepository.save(existingTask));
    }

    @Transactional
    public Mono<Task> createTask(Map<String, Object> data) {
        Task newTask = new Task();

        newTask.setName((String) data.get("name"));
        newTask.setYearLevel(YearLevel.valueOf((String) data.get("yearLevel")));

        if (data.containsKey("description")) {
            newTask.description = (String) data.get("description");
        }

        if (data.get("taskType").equals("artifact")) {
            newTask.setTaskType((String) data.get("taskType"));
            newTask.setArtifactName((String) data.get("artifactName"));
            newTask.setEvent(null);
        }
        else if (data.get("taskType").equals("event")) {
            newTask.setTaskType((String) data.get("taskType"));
            Event assignedEvent = eventRepository.findById(Integer.parseInt((String) data.get("event")));
            newTask.setEvent(assignedEvent);
            newTask.setArtifactName(null);
        }

        return Mono.just(taskRepository.save(newTask));
    }

    
}
