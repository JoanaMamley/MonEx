package com.monex.monex_backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA will automatically implement this method for us
    Optional<User> findByEmail(String email);
}
