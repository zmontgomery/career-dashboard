package com.senior.project.backend.security;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.Session;
import com.senior.project.backend.security.domain.TempUser;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @InjectMocks
    private AuthService CuT;

    @Mock
    private AuthRepository authRepository;

    private Session session1;
    private Session session2;

    private List<Session> sessions;

    public void setup() {
        session1 = Session.builder()
            .email("test@test.test")
            .id(UUID.randomUUID())
            .valid(true)
            .build();
        
        session2 = Session.builder()
            .id(UUID.randomUUID())
            .build();

        sessions = new ArrayList<>();
        sessions.add(session1);
        sessions.add(session2);

        CuT = spy(CuT);
    }

    @Test
    public void testAll() {
        setup();
        when(authRepository.findAll()).thenReturn(sessions);

        Flux<Session> result = CuT.all();
        StepVerifier.create(result)
            .expectNext(session1)
            .expectNext(session2)
            .expectComplete()
            .verify();
    }

    @Test
    public void testRetreiveSessionHappy() {
        setup();
        when(authRepository.findById(any())).thenReturn(Optional.of(session1));
        Mono<Session> result = CuT.retrieveSession(session1.getId().toString());
        StepVerifier.create(result)
            .expectNext(session1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testRetreiveSessionUnhappy() {
        setup();
        when(authRepository.findById(any())).thenReturn(Optional.empty());
        try {
            CuT.retrieveSession(session1.getId().toString());
            fail();
        } catch(Exception e) {
            return;
        }
    }

    @Test
    public void testCreateSession() {
        setup();
        when(authRepository.saveAndFlush(any())).thenReturn(session1);

        Mono<Session> result = CuT.createSession("test");

        StepVerifier.create(result)
            .expectNext(session1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testGenerateResponse() {
        setup();
        LoginResponse expected = LoginResponse.builder()
            .sessionID(session1.getId())
            .user(TempUser.builder().email(session1.getEmail()).build())
            .build();


        Mono<LoginResponse> result = CuT.generateResponse(session1);

        StepVerifier.create(result)
            .expectNext(expected)
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteSession() {
        setup();
        when(authRepository.findById(any())).thenReturn(Optional.of(session1));

        Mono<Session> result = CuT.deleteSession(session1.getId().toString());

         StepVerifier.create(result)
            .expectNext(session1)
            .expectComplete()
            .verify();
        
        verify(authRepository, times(1)).findById(any());
        verify(authRepository, times(1)).deleteById(any());
    }
}
