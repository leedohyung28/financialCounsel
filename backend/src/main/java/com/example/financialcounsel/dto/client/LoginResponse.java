package com.example.financialcounsel.dto.client;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private int resultCode;
    private String message;

    public static LoginResponse of(int resultCode, String message) {
        return new LoginResponse(resultCode, message);
    }
}
