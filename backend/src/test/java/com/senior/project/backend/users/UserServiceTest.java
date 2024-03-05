package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

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
import com.senior.project.backend.TestUtil;
import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
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
            .expectNext(Constants.user1)
            .expectNext(Constants.user2)
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
        TestUtil.testError(() -> userService.findByEmailAddress(Constants.user1.getEmail()), EntityNotFoundException.class);
    }

    @Test
    public void findByEmailAddressHappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.user1));
        
        Mono<User> user = userService.findByEmailAddress(Constants.user1.getEmail());

        StepVerifier.create(user)
            .expectNext(Constants.user1)
            .expectComplete()
            .verify();
    }

    @Test
    public void findByEmailAddressUnhappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        TestUtil.testError(() -> userService.findByEmailAddress(Constants.user1.getEmail()), EntityNotFoundException.class);
    }

    @Test
    public void findByUsernameHappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.user1));
        
        Mono<UserDetails> user = userService.findByUsername(Constants.user1.getEmail());

        StepVerifier.create(user)
            .expectNext((UserDetails) Constants.user1)
            .expectComplete()
            .verify();
    }

    @Test
    public void findByUsernameUnhappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        TestUtil.testError(() -> userService.findByUsername(Constants.user1.getEmail()), EntityNotFoundException.class);
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
        Constants.user1.setRole(Role.SuperAdmin);
        when(userRepository.findUsersByRole(Role.SuperAdmin)).thenReturn(Constants.USERS);
        when(userRepository.findUserByEmail(any())).thenReturn(Optional.of(Constants.user2));

        userService.setSuperUser();

        assertFalse(Constants.user1.hasSuperAdminPrivileges());
        verify(userRepository, times(3)).save(any());
        assertTrue(Constants.user2.hasSuperAdminPrivileges());

        Constants.user2.setRole(Role.SuperAdmin);
    }

    @Test
    public void setSuperUserError() {
        Constants.user1.setRole(Role.SuperAdmin);
        when(userRepository.findUsersByRole(Role.SuperAdmin)).thenReturn(Constants.USERS);
        when(userRepository.findUserByEmail(any())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.setSuperUser());

        assertFalse(Constants.user1.hasSuperAdminPrivileges());
        verify(userRepository, times(2)).save(any());
        assertFalse(Constants.user2.hasSuperAdminPrivileges());

    }
}
