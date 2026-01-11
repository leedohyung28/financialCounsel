package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.OtpRegistrationResponse;
import com.example.financialcounsel.dto.client.OtpVerifyRequest;
import com.example.financialcounsel.global.common.CommonResponse;
import com.example.financialcounsel.service.OtpService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {
    private final OtpService otpService;

    // QR코드 생성을 위한 정보를 반환
    @PostMapping("/setup")
    public ResponseEntity<CommonResponse<OtpRegistrationResponse>> generateSecret(@RequestBody ClientVO clientVO, HttpSession session) {
        try {
            OtpRegistrationResponse response = otpService.generateSecret(clientVO, session);
            return ResponseEntity.ok(CommonResponse.success(response));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .internalServerError() // 500 에러 또는 .badRequest() 선택 가능
                    .body(CommonResponse.error("OTP 생성 중 오류가 발생했습니다: " + e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(CommonResponse.error("알 수 없는 서버 오류가 발생했습니다."));
        }
    }

    // 사용자가 입력한 6자리 OTP 검증
    @PostMapping("/verify-init")
    public ResponseEntity<CommonResponse<?>> verifyInitCode(@RequestBody OtpVerifyRequest otpVerifyRequest, HttpSession session) {
        try {
            boolean isValid = otpService.verifyInitCode(otpVerifyRequest, session);

            if (isValid) {
                // 검증 성공 시 JWT 토큰 발급 등 로그인 처리
                return ResponseEntity.ok(CommonResponse.success(null));
            } else {
                return ResponseEntity.badRequest().body(CommonResponse.error(null));
            }
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(CommonResponse.error(e.toString()));
        }
    }

    // 사용자가 입력한 6자리 OTP 검증
    @PostMapping("/verify")
    public ResponseEntity<CommonResponse<?>> verifyCode(@RequestBody OtpVerifyRequest otpVerifyRequest, HttpSession session) {
        try {
            boolean isValid = otpService.verifyCode(otpVerifyRequest, session);

            if (isValid) {
                return ResponseEntity.ok(CommonResponse.success(null));
            } else {
                return ResponseEntity.badRequest().body(CommonResponse.error("인증번호가 틀렸습니다."));
            }
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(CommonResponse.error(e.toString()));
        }
    }
    // OTP 재등록
    @PostMapping("/update")
    public ResponseEntity<CommonResponse<?>> updateSecretKey(@RequestBody OtpVerifyRequest otpVerifyRequest) {
        try {
            // 서비스 내부에서 gAuth.authorize 검증 후, 실패 시 RuntimeException을 던짐
            otpService.updateOtpSecretKey(otpVerifyRequest);

            // 여기까지 코드가 내려왔다면 인증 및 DB 업데이트에 성공한 것임
            return ResponseEntity.ok(CommonResponse.success(null));

        } catch (RuntimeException e) {
            // 서비스에서 던진 "인증 코드가 일치하지 않습니다" 등의 메시지를 그대로 전달
            // e.toString() 보다는 e.getMessage()가 사용자에게 더 친절한 메시지를 전달합니다.
            return ResponseEntity.badRequest().body(CommonResponse.error(e.getMessage()));
        } catch (Exception e) {
            // 그 외 서버 내부 오류 처리
            return ResponseEntity.internalServerError().body(CommonResponse.error("서버 처리 중 오류가 발생했습니다."));
        }
    }
}
