package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Faculty;
import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class FacultyServiceTest {
    @InjectMocks
    private FacultyService facultyService;

    @Mock
    private FacultyRepository facultyRepository;

    @Test
    public void testAll() {
        when(facultyRepository.findAll()).thenReturn(Constants.FACULTY);
        Flux<Faculty> result = facultyService.allFaculty();
        StepVerifier.create(result)
            .expectNext(Constants.faculty1)
            .expectNext(Constants.faculty2)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailHappy() {
        when(facultyRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.faculty1));
        Mono<User> result = facultyService.findByEmailAddress(Constants.faculty1.getEmail());
        StepVerifier.create(result)
            .expectNext(Constants.faculty1)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailUnhappy() {
        when(facultyRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());

        try {
            facultyService.findByEmailAddress(Constants.faculty1.getEmail());
            fail("Error should have been thrown");
        } catch (EntityNotFoundException e) {
            return;
        }
    }
}
