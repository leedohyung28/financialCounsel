package com.example.financialcounsel.global.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommonResponse<T> {
    private boolean success;
    private String message;
    private T data;

    // 성공 시 사용
    public static <T> CommonResponse<T> success(T data) {
        return new CommonResponse<>(true, "성공", data);
    }

    // 실패 시 사용
    public static <T> CommonResponse<T> error(String message) {
        return new CommonResponse<>(false, message, null);
    }
}
