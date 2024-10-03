package com.senior.project.backend.users;

import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;

import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.UsersSearchResponse;
import com.senior.project.backend.security.CurrentUserUtil;

import reactor.core.publisher.Mono;

/**
 * Handler for users
 *
 * @author Jim Logan - jrl9984@rit.edu
 */
@Component
public class UserHandler {
    @Autowired
    private UserService service;

    @Autowired
    private CurrentUserUtil currentUserUtil;

    /**
     * Gets all users from the user service
     *
     * @param serverRequest - request
     * @return 200 with body of all users
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(service.allUsers(), User.class);
    }

    /**
     * Gets the current user from the security context and returns it
     *
     * @param request - request
     * @return 200 with the user
     */
    public Mono<ServerResponse> currentUser(ServerRequest request) {
        return ServerResponse.ok().body(currentUserUtil.getCurrentUser(), User.class);
    }

    /**
     * Gets users user service parsing query params for paging info and searchTerm
     *
     * @param request - ServerRequest
     * @return 200 with body of users in search on page
     */
    public Mono<ServerResponse> searchUsers(ServerRequest request) {
        try {
            int pageOffset = Integer.parseInt(request.queryParam("pageOffset").orElseThrow());
            int pageSize = Integer.parseInt(request.queryParam("pageSize").orElseThrow());
            String searchTerm = request.queryParam("searchTerm").orElseThrow();

            UsersSearchResponse response = new UsersSearchResponse(
                    service.searchAndPageUsers(pageOffset, pageSize, searchTerm));

            return ServerResponse.ok().body(Mono.just(response), UsersSearchResponse.class);
        } catch (NumberFormatException | NoSuchElementException e) {

            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "valid query params: pageOffset: number, pageSize: number, searchTerm: string"));
        }
    }

    /**
     * Gets a user by their id
     *
     * @param request - ServerRequest
     * @return 200 with user
     *         404 when user is not found
     */
    public Mono<ServerResponse> byId(ServerRequest request) {
        return Mono.just(request.pathVariable("id"))
                .map(id -> UUID.fromString(id))
                .flatMap(id -> service.findById(id))
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "User was not found.")))
                .flatMap(user -> ServerResponse.ok().bodyValue(user));
    }

    /**
     * Updates a users role
     *
     * @return the user with the new role
     */
    public Mono<ServerResponse> updateRole(ServerRequest request) {
        currentUserUtil.getCurrentUser().subscribe((u) -> System.out.println("asdf"));
        return request.bodyToMono(User.class)
                .zipWith(currentUserUtil.getCurrentUser())
                .flatMap(users -> updateRoleCheck(users.getT1(), users.getT2()))
                .flatMap((user) -> ServerResponse.ok().bodyValue(user));
    }

    /**
     * The error for if updating a role fails
     */
    private static final Mono<User> UPDATE_ROLE_ERROR = Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN));

    /**
     * Updates a user role. A role can only be udpated to admin as a super admin
     *
     * @param edited  is the user being edited
     * @param current is the current user
     * @return a mono containing the updated user or an error
     */
    private Mono<User> updateRoleCheck(User edited, User current) {
        System.out.println(edited);
        System.out.println(current);
        Role newRole = edited.getRole();
        if (newRole == Role.Admin) {
            if (current.hasSuperAdminPrivileges())
                return service.createOrUpdateUser(edited);
            else
                return UPDATE_ROLE_ERROR;
        } else {
            if (current.hasAdminPrivileges())
                return service.createOrUpdateUser(edited);
            else
                return UPDATE_ROLE_ERROR;
        }
    }
}
