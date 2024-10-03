package com.senior.project.backend.users;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;

import jakarta.transaction.Transactional;

/**
 * Repostory that interacts the the `user` table in the database
 *
 * @author Jim Logan - jrl9984@rit.edu
 */
public interface UserRepository extends JpaRepository<User, UUID> {
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmail(@Param("email") String email);

    List<User> findUsersByRole(Role role);

    List<User> findUsersByCanEmailIsTrue();

    List<User> findUsersByCanTextIsTrue();

    @Query("SELECT e FROM User e WHERE CONCAT(e.firstName, ' ', e.lastName) LIKE :name% OR e.lastName LIKE :name%")
    Page<User> findByFullNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.profilePictureId = :pictureId WHERE u.id = :userId")
    void updateProfilePictureId(@Param("userId") UUID userId, @Param("pictureId") Integer pictureId);
}
