package com.senior.project.backend.users;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.senior.project.backend.domain.User;

/**
 * Repostory that interacts the the `user` table in the database
 * 
 * @author Jim Logan - jrl9984@rit.edu
 */
public interface UserRepository extends JpaRepository<User, UUID> { 
    @Query("SELECT u FROM User u WHERE u.email = :email")
    public Optional<User> findUserByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.isSuperAdmin = TRUE")
    public List<User> findSuperAdmins();
}
