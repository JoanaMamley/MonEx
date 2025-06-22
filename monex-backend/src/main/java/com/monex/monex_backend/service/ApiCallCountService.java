package com.monex.monex_backend.service;

import com.monex.monex_backend.entity.ApiCallCount;
import com.monex.monex_backend.repository.ApiCallCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ApiCallCountService {
    @Autowired
    private ApiCallCountRepository apiCallCountRepository;

    public Integer getCurrentCount(){
        return apiCallCountRepository.findById(1L).map(ApiCallCount::getCount).orElse(0);
    }

    public void incrementCurrentCount(){
        Optional<ApiCallCount> optionRecord = apiCallCountRepository.findById(1L);

        if (optionRecord.isPresent()) {
            ApiCallCount countRecord = optionRecord.get();
            int current = countRecord.getCount() == null ? 0 : countRecord.getCount();
            countRecord.setCount(current+1);
            apiCallCountRepository.save(countRecord);
        } else {
            ApiCallCount newRecord = new ApiCallCount(1);
            apiCallCountRepository.save(newRecord);
        }
    }
}
