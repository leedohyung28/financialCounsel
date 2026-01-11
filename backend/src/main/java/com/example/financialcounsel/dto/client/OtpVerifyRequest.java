package com.example.financialcounsel.dto.client;

import com.example.financialcounsel.global.annotation.FieldName;
import lombok.Data;
import lombok.NonNull;
import lombok.Setter;

@Data
public class OtpVerifyRequest {

    @Setter
    @NonNull @FieldName("직원이메일")
    private String email;

    @Setter
    @FieldName("QR코드 인증번호")
    private int code;

    @Setter
    @FieldName("QR시크릿키")
    private String secretKey;
}
