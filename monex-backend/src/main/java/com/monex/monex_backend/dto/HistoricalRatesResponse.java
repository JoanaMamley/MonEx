package com.monex.monex_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class HistoricalRatesResponse {
    private boolean success;
    private String terms;
    private String privacy;
    private boolean historical;
    private String date;
    private Long timestamp;
    private String source;
    private Map<String, Double> quotes;
}
