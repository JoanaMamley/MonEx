package com.monex.monex_backend.repository;

import com.monex.monex_backend.entity.ApiCallCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiCallCountRepository extends JpaRepository<ApiCallCount, Long> {
    Optional<ApiCallCount> findById(Long id);
}
