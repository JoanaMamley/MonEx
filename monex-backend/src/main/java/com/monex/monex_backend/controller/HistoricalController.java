package com.monex.monex_backend.controller;

import com.monex.monex_backend.entity.HistoricalRate;
import com.monex.monex_backend.service.HistoricalRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historical")
@CrossOrigin(origins = "http://localhost:4200")
public class HistoricalController {
    @Autowired
    private HistoricalRateService historicalRateService;

    @GetMapping
    public ResponseEntity<List<HistoricalRate>> getHistoricalRates(@RequestParam String date) {
        return ResponseEntity.ok(historicalRateService.getHistoricalRates(date));
    }
}
