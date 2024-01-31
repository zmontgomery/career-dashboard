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

public class FacultyServiceTest {
    @InjectMocks
    private FacultyService facultyService;

    @Mock
    private UserRepository facultyRepository;

    @Test
    public void testAll() {
        when(facultyRepository.findAll()).thenReturn(Constants.USERS);
        Flux<User> result = facultyService.allFaculty();
        StepVerifier.create(result)
            .expectNext(Constants.faculty1)
            .expectNext(Constants.faculty2)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailHappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.user1));
        Mono<User> result = userService.findByEmailAddress(Constants.user1.getEmail());
        StepVerifier.create(result)
            .expectNext(Constants.user1)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailUnhappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());

        try {
            userService.findByEmailAddress(Constants.user1.getEmail());
            fail("Error should have been thrown");
        } catch (EntityNotFoundException e) {
            return;
        }
    }
}
