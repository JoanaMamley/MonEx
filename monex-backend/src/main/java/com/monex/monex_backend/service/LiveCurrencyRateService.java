package com.monex.monex_backend.service;

import com.monex.monex_backend.dto.HistoricalRatesResponse;
import com.monex.monex_backend.dto.LiveCurrencyRateResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class LiveCurrencyRateService {
    @Autowired
    private WebClient webClient;

    @Value("${currencylayer.api.key}")
    private String apiKey;

    private LiveCurrencyRateResponse fetchLiveCurrencyData(String source, String target){
        return webClient.get().uri("/live?access_key=" + apiKey + "&currencies=" + source + "," + target)
                .accept(MediaType.APPLICATION_JSON).retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response -> response.bodyToMono(String.class).flatMap(body ->
                        Mono.error(new RuntimeException("Client error: " + body))
                ))
                .onStatus(HttpStatusCode::is5xxServerError, response -> response.bodyToMono(String.class).flatMap(body ->
                        Mono.error(new RuntimeException("Server error: " + body))
                ))
                .bodyToMono(LiveCurrencyRateResponse.class).block();
    }

    public Map<String, Double> getLiveCurrencyData(String source, String target){
        return fetchLiveCurrencyData(source, target).getQuotes();
    }
}
