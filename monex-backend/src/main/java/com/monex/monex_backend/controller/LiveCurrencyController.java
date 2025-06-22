package com.monex.monex_backend.controller;

import com.monex.monex_backend.service.LiveCurrencyRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/live")
@CrossOrigin(origins = "http://localhost:4200")
public class LiveCurrencyController {

    @Autowired
    private LiveCurrencyRateService liveCurrencyRateService;

    @GetMapping
    public ResponseEntity<Map<String, Double>> getLiveCurrencyData(@RequestParam String source, @RequestParam String target){
        return ResponseEntity.ok(liveCurrencyRateService.getLiveCurrencyData(target, source));
    }
}
