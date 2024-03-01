package com.senior.project.backend.users;

import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.UsersSearchResponse;
import com.senior.project.backend.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

import java.util.NoSuchElementException;

/**
 * Handler for users
 * 
 * @author Jim Logan - jrl9984@rit.edu
 */
@Component
public class UserHandler {
    @Autowired
    private UserService service;

    /**
     * Gets all users from the user service
     * @param serverRequest - request
     * @return 200 with body of all users
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(service.allUsers(), User.class);
    }

    /**
     * Gets the current user from the security context and returns it
     * @param request - request
     * @return 200 with the user
     */
    public Mono<ServerResponse> currentUser(ServerRequest request) {
        return ServerResponse.ok().body(SecurityUtil.getCurrentUser(), User.class);
    }

    /**
     * Gets users user service parsing query params for paging info and searchTerm
     * @param request - ServerRequest
     * @return 200 with body of users in search on page
     */
    public Mono<ServerResponse> searchUsers(ServerRequest request) {
        try {
            int pageOffset = Integer.parseInt(request.queryParam("pageOffset").orElseThrow());
            int pageSize = Integer.parseInt(request.queryParam("pageSize").orElseThrow());
            String searchTerm = request.queryParam("searchTerm").orElseThrow();

            UsersSearchResponse response = new UsersSearchResponse(service.searchAndPageUsers(pageOffset, pageSize, searchTerm));

            return ServerResponse.ok().body(Mono.just(response), UsersSearchResponse.class);
        }
        catch (NumberFormatException | NoSuchElementException e) {

            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "valid query params: pageOffset: number, pageSize: number, searchTerm: string"));
        }
    }

    public Mono<ServerResponse> updateRole(ServerRequest request) {
        return request.bodyToMono(User.class)
            .zipWith(SecurityUtil.getCurrentUser())
            .flatMap(users -> {
                Role newRole = users.getT1().getRole();
                if (newRole == Role.Faculty) {}
            })
    }

    private Mono<User> updateRoleCheck(User edited, User current) {
        Role newRole = edited.getRole();
        Mono<User> returnValue;
        switch (newRole) {
            case Admin: 
                if (current.hasSuperAdminPrivileges()) service.
                else Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN));
                break;
            default:
                break;
        }
    }
}
