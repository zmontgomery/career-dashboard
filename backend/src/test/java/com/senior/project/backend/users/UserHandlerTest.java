package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.User;

import reactor.core.publisher.Flux;

@ExtendWith(MockitoExtension.class)
public class UserHandlerTest {
    @InjectMocks
    private UserHandler userHandler;

    @Mock
    private UserService userService;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/api/test", userHandler::all)
                        .build())
                .build();
    }

    @Test
    public void testAllUsers() {
        when(userService.allUsers()).thenReturn(Flux.fromIterable(Constants.USERS));
        List<User> res = webTestClient.get()
            .uri("/api/test")
            .exchange()
            .expectStatus()
            .isOk()
            .expectBodyList(User.class)
            .returnResult()
            .getResponseBody();

        assertEquals(Constants.USERS.get(0), res.get(0));
        assertEquals(Constants.USERS.get(1), res.get(1));
    }
}
