package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import com.senior.project.backend.domain.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.User;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
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
            .expectNext(Constants.userAdmin)
            .expectNext(Constants.userFaculty)
            .expectNext(Constants.userStudent)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailHappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.userAdmin));
        Mono<User> result = userService.findByEmailAddress(Constants.userAdmin.getEmail());
        StepVerifier.create(result)
            .expectNext(Constants.userAdmin)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailUnhappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        Mono<User> result = userService.findByEmailAddress(Constants.userAdmin.getEmail());
        StepVerifier.create(result)
            .expectComplete()
            .verify();
    }

    @Test
    public void findByIdHappy() {
        when(userRepository.findById(Constants.userAdmin.getId())).thenReturn(Optional.of(Constants.userAdmin));
        Mono<User> result = userService.findByID(Constants.userAdmin.getId());
        StepVerifier.create(result)
            .expectNext(Constants.userAdmin)
            .expectComplete()
            .verify();
    }

    @Test
    public void findByIdUnhappy() {
        when(userRepository.findById(Constants.userAdmin.getId())).thenReturn(Optional.empty());
        Mono<User> result = userService.findByID(Constants.userAdmin.getId());
        StepVerifier.create(result)
            .expectError();
    }

    @Test
    public void findByUsernameHappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.userAdmin));
        
        Mono<UserDetails> user = userService.findByUsername(Constants.userAdmin.getEmail());

        StepVerifier.create(user)
            .expectNext((UserDetails) Constants.userAdmin)
            .expectComplete()
            .verify();
    }

    @Test
    public void findByUsernameUnhappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        Mono<UserDetails> result = userService.findByUsername(Constants.userAdmin.getEmail());
        StepVerifier.create(result)
            .expectComplete()
            .verify();
    }

    @Test
    public void searchUsers() {
        int pageOffset = 0;
        int pageSize = 10;
        String searchTerm = "search";
        Pageable pageable = PageRequest.of(pageOffset, pageSize);
        var page = new PageImpl<>(Constants.USERS, pageable, Constants.USERS.size());

        when(userRepository.findByFullNameContainingIgnoreCase(searchTerm, pageable)).thenReturn(page);

        Page<User> usersPage = userService.searchAndPageUsers(pageOffset, pageSize, searchTerm);

        assertEquals(usersPage, page);
    }

    @Test
    public void setSuperUser() {
        Constants.userAdmin.setRole(Role.SuperAdmin);
        when(userRepository.findUsersByRole(Role.SuperAdmin)).thenReturn(Constants.USERS);
        when(userRepository.findUserByEmail(any())).thenReturn(Optional.of(Constants.userFaculty));

        userService.setSuperUser();

        assertFalse(Constants.userAdmin.hasSuperAdminPrivileges());
        verify(userRepository, times(Constants.USERS.size() + 1)).save(any());
        assertTrue(Constants.userFaculty.hasSuperAdminPrivileges());

        Constants.userFaculty.setRole(Role.SuperAdmin);
    }

    @Test
    public void setSuperUserError() throws InterruptedException {
        Constants.userAdmin.setRole(Role.SuperAdmin);
        when(userRepository.findUsersByRole(Role.SuperAdmin)).thenReturn(Constants.USERS);
        when(userRepository.findUserByEmail(any())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, userService::setSuperUser);

        assertFalse(Constants.userAdmin.hasSuperAdminPrivileges());
        verify(userRepository, times(Constants.USERS.size())).save(any());
        assertFalse(Constants.userFaculty.hasSuperAdminPrivileges());
    }

    @Test
    public void testCreateOrUpdateUser() {
        when(userRepository.saveAndFlush(any())).thenReturn(Constants.userAdmin);
        Mono<User> res = userService.createOrUpdateUser(Constants.userFaculty);
        
        StepVerifier.create(res)
            .expectNext(Constants.userAdmin)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByIdHappy() {
        when(userRepository.findById(any())).thenReturn(Optional.of(Constants.userAdmin));
        Mono<User> res = userService.findById(UUID.randomUUID());

        StepVerifier.create(res)
            .expectNext(Constants.userAdmin)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByIdNotFound() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());
        Mono<User> res = userService.findById(UUID.randomUUID());

        StepVerifier.create(res)
            .expectComplete()
            .verify();
    }
}
