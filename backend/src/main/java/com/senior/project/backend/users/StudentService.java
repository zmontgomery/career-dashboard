package com.senior.project.backend.users;

import java.util.Optional;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.Student;
import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
    public Flux<Student> allStudents() {
        return Flux.fromIterable(repository.findAll());
    }

    /**
     * Retrieves a student from the database using their university id
     * @param email - the email address belonging to the er
     * @return the user
     * @throws EntityNotFoundException if the user with the provided email does not exist
     */
    public Mono<Student> findByUniversityId(int universityId) throws EntityNotFoundException {
        Optional<Student> student = repository.findStudentByUniversityId(universityId);
        LoggerFactory.getLogger(getClass()).info(Integer.toString(universityId));
        if (student.isPresent()) {
            return Mono.just(student.get());
        } else {
            throw new EntityNotFoundException();
        }
    }
}
