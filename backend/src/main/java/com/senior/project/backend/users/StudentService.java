package com.senior.project.backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.Student;
import com.senior.project.backend.domain.User;

import reactor.core.publisher.Flux;

/**
 * Service that interacts with the student repository
 * 
 * @author Riley Brotz - rcb2957@rit.edu
 */
@Service
public class StudentService extends UserService{
    @Autowired
    private StudentRepository repository;

    /**
     * Gets all students from the database
     * @return all the students
     */
    public Flux<User> allStudents() {
        return Flux.fromIterable(repository.findAll());
    }
}
