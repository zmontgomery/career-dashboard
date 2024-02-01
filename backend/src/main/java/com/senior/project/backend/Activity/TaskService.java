package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Task;

import java.util.Map;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) { this.taskRepository = taskRepository;}
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

        // TODO: add the rest of the task properties 
        if (updates.containsKey("description")) {
            existingTask.description = (String) updates.get("description");
        }

        return Mono.just(taskRepository.save(existingTask));
    }

    
}
