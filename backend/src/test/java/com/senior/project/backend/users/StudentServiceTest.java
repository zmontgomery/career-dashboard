package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

public class StudentServiceTest {
    @InjectMocks
    private StudentService studentService;

    @Mock
    private StudentRepository studentRepository;

    @Test
    public void testAll() {
        when(studentRepository.findAll()).thenReturn(Constants.STUDENTS);
        Flux<User> result = studentService.allStudents();
        StepVerifier.create(result)
            .expectNext(Constants.student1)
            .expectNext(Constants.student2)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailHappy() {
        when(studentRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.student1));
        Mono<User> result = studentService.findByEmailAddress(Constants.student1.getEmail());
        StepVerifier.create(result)
            .expectNext(Constants.student1)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailUnhappy() {
        when(studentRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());

        try {
            studentService.findByEmailAddress(Constants.student1.getEmail());
            fail("Error should have been thrown");
        } catch (EntityNotFoundException e) {
            return;
        }
    }
}
