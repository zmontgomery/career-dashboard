package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import com.senior.project.backend.domain.UsersSearchResponse;
import com.senior.project.backend.security.CurrentUserUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class UserHandlerTest {
    @InjectMocks
    private UserHandler userHandler;

    @Mock
    private UserService userService;

    @Mock
    private CurrentUserUtil currentUserUtil;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
            .GET("/api/test", userHandler::all)
            .GET("/search", userHandler::searchUsers)
            .GET("/curr", userHandler::currentUser)
            .POST("/update", userHandler::updateRole)
            .GET("id/{id}", userHandler::byId)
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

        assertNotNull(res);
        assertEquals(Constants.USERS.get(0), res.get(0));
        assertEquals(Constants.USERS.get(1), res.get(1));
    }

    @Test
    public void testSearchUsersError() {
        webTestClient.get()
                .uri("/search")
                .exchange()
                .expectStatus()
                .is4xxClientError();
    }

    @Test
    public void testSearchUsers() {
        int pageOffset = 0;
        int pageSize = 10;
        String searchTerm = "search";
        Pageable pageable = PageRequest.of(pageOffset, pageSize);

        var page = new PageImpl<>(Constants.USERS, pageable, Constants.USERS.size());

        when(userService.searchAndPageUsers(pageOffset, pageSize, searchTerm)).thenReturn(page);
        UsersSearchResponse response = webTestClient.get()
                .uri("/search?pageOffset="+pageOffset+
                        "&pageSize="+pageSize+
                        "&searchTerm="+searchTerm)
                .exchange()
                .expectStatus()
                .isOk()
                .expectBody(UsersSearchResponse.class)
                .returnResult()
                .getResponseBody();

        assertNotNull(response);
        assertEquals(Constants.USERS.get(0), response.getUsers().get(0));
        assertEquals(Constants.USERS.get(1), response.getUsers().get(1));
        assertEquals(Constants.USERS.size(), response.getTotalResults());
    }

    @Test
    public void testCurrentUser() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));

        User user = webTestClient.get()
            .uri("/curr")
            .exchange()
            .expectStatus()
            .isOk()
            .expectBody(User.class)
            .returnResult()
            .getResponseBody();

        assertEquals(user, Constants.user1);
    }

    @Test
    public void testUpdateRoleHappy() {
        when(userService.createOrUpdateUser(any())).thenReturn(Mono.just(Constants.user2));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));

        User user = webTestClient.post()
            .uri("/update")
            .bodyValue(Constants.user2)
            .exchange()
            .expectStatus()
            .isOk()
            .expectBody(User.class)
            .returnResult()
            .getResponseBody();

        assertEquals(user, Constants.user2);
    }

    @Test
    public void testUpdateRoleSuperAdmin() {
        User superUser = User.builder().role(Role.SuperAdmin).build();
        User test = User.builder().role(Role.Admin).build();
        when(userService.createOrUpdateUser(any())).thenReturn(Mono.just(Constants.user2));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(superUser));

        User user = webTestClient.post()
            .uri("/update")
            .bodyValue(test)
            .exchange()
            .expectStatus()
            .isOk()
            .expectBody(User.class)
            .returnResult()
            .getResponseBody();

        assertEquals(user, Constants.user2);
    }

    @Test
    public void testUpdateRoleInvalidPerms() {
        User user = User.builder().role(Role.Admin).build();
        User test = User.builder().role(Role.Admin).build();
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));

        webTestClient.post()
            .uri("/update")
            .bodyValue(test)
            .exchange()
            .expectStatus()
            .isForbidden();
    }

    @Test
    public void testUpdateRoleInvalidPerms2() {
        User user = User.builder().role(Role.Faculty).build();
        User test = User.builder().role(Role.Student).build();
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(user));

        webTestClient.post()
            .uri("/update")
            .bodyValue(test)
            .exchange()
            .expectStatus()
            .isForbidden();
    }

    @Test
    public void testGetUserById() {
        when(userService.findById(any())).thenReturn(Mono.just(Constants.user1));

        User res = webTestClient.get()
            .uri("/id/" + UUID.randomUUID().toString())
            .exchange()
            .expectStatus().isOk()
            .expectBody(User.class)
            .returnResult()
            .getResponseBody();

        assertEquals(res, Constants.user1);
    }

    @Test
    public void testGetUserByIdNotFound() {
        when(userService.findById(any())).thenReturn(Mono.empty());

        webTestClient.get()
            .uri("/id/" + UUID.randomUUID().toString())
            .exchange()
            .expectStatus()
            .isNotFound();
    }
}
