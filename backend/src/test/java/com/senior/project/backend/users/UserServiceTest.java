package com.senior.project.backend.users;

import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.User;

import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
     @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Test
    public void testAll() {
        when(userRepository.findAll()).thenReturn(Constants.USERS);
        Flux<User> result = userService.allUsers();
        StepVerifier.create(result)
            .expectNext(Constants.user1)
            .expectNext(Constants.user2)
            .expectComplete()
            .verify();
    }
}
