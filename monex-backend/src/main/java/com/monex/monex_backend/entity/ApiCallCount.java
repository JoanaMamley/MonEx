package com.monex.monex_backend.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "api_count")
public class ApiCallCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer count;

    public ApiCallCount(Integer count) {
        this.count = count;
    }
}
