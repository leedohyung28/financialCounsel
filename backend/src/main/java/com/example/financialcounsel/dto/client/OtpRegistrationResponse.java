package com.example.financialcounsel.dto.client;

import com.example.financialcounsel.global.annotation.FieldName;
import lombok.*;

@Data
@AllArgsConstructor
public class OtpRegistrationResponse {
    @Getter
    @NonNull
    @FieldName("시크릿키")
    private String secretKey;

    @Getter
    @NonNull
    @FieldName("QR코드 주소")
    private String qrCodeUrl;

}
