package com.monex.monex_backend.controller;

import com.monex.monex_backend.service.ApiCallCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/count")
@CrossOrigin(origins = "http://34.55.103.66:4200")
public class ApiCallCountController {

    @Autowired
    private ApiCallCountService apiCallCountService;

    @GetMapping
    public ResponseEntity<Integer> getCurrentCount(){
        return ResponseEntity.ok(apiCallCountService.getCurrentCount());
    }
}
