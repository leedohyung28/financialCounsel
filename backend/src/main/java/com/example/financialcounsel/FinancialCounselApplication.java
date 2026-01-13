package com.example.financialcounsel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.retry.annotation.EnableRetry;

@EnableRetry
@EnableAsync
@SpringBootApplication
public class FinancialCounselApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancialCounselApplication.class, args);
    }
}
