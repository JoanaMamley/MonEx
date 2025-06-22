package com.monex.monex_backend.service;

import com.monex.monex_backend.dto.HistoricalRatesResponse;
import com.monex.monex_backend.entity.HistoricalRate;
import com.monex.monex_backend.repository.HistoricalRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HistoricalRateService {
    @Autowired
    private HistoricalRateRepository historicalRateRepository;

    @Autowired
    private ApiCallCountService apiCallCountService;

    @Autowired
    private WebClient webClient;

    @Value("${currencylayer.api.key}")
    private String apiKey;


    private HistoricalRatesResponse fetchHistoricalRatesData(String date) {
        apiCallCountService.incrementCurrentCount();
        return webClient.get().uri("/historical?access_key=" + apiKey + "&date=" + date)
                .accept(MediaType.APPLICATION_JSON).retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response -> response.bodyToMono(String.class).flatMap(body ->
                        Mono.error(new RuntimeException("Client error: " + body))
                ))
                .onStatus(HttpStatusCode::is5xxServerError, response -> response.bodyToMono(String.class).flatMap(body ->
                        Mono.error(new RuntimeException("Server error: " + body))
                ))
                .bodyToMono(HistoricalRatesResponse.class).block();
    }


    public List<HistoricalRate> getHistoricalRates(String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        List<HistoricalRate> rates = historicalRateRepository.findByDate(date);
        if (rates.isEmpty()) {
            HistoricalRatesResponse data = fetchHistoricalRatesData(dateStr);
            Map<String, Double> quotes = data.getQuotes();
            rates = quotes.entrySet().stream().map(entry -> {
                HistoricalRate rate = new HistoricalRate();
                rate.setDate(date);
                rate.setCurrency(entry.getKey().substring(3));
                rate.setRate(entry.getValue());
                return rate;
            }).collect(Collectors.toList());
            historicalRateRepository.saveAll(rates);
        }
        return rates;
    }
}
