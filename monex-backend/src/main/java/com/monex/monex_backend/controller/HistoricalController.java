package com.monex.monex_backend.controller;

import com.monex.monex_backend.entity.HistoricalRate;
import com.monex.monex_backend.service.HistoricalRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/historical")
public class HistoricalController {
    @Autowired
    private HistoricalRateService historicalRateService;

    @GetMapping
    public ResponseEntity<List<HistoricalRate>> getHistoricalRates(@RequestParam String date) {
        return ResponseEntity.ok(historicalRateService.getHistoricalRates(date));
    }
}
