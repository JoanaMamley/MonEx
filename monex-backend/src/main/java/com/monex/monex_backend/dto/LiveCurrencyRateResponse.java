package com.monex.monex_backend.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class LiveCurrencyRateResponse {
    private boolean success;
    private String terms;
    private String privacy;
    private Long timestamp;
    private String source;
    private Map<String, Double> quotes;
}
