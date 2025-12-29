package com.example.financialcounsel.domain;

import org.springframework.data.annotation.Id;
import lombok.Data;

@Data
public class AddressVO {
    @Id
    private String id;

    // 입력정보
    private String inputKeyword;
    private String outputKeyword;
}