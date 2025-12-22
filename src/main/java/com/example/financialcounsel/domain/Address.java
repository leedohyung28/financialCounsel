package com.example.financialcounsel.domain;

import org.springframework.data.annotation.Id;
import lombok.Data;

@Data
public class Address {
    @Id
    private String id;
    private String inputKeyword;
    private String outputKeyword;
}