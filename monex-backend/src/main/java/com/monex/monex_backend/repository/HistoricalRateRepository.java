package com.monex.monex_backend.repository;

import com.monex.monex_backend.entity.HistoricalRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HistoricalRateRepository extends JpaRepository<HistoricalRate, Long> {
    List<HistoricalRate> findByDate(LocalDate date);
}
