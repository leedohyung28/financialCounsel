package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.global.common.CommonResponse;
import com.example.financialcounsel.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/temp")
    public ResponseEntity<CommonResponse<String>> sendTemporaryPassword(@RequestBody ClientVO clientVO) {
        try {
            emailService.sendTemporaryPassword(clientVO);
            // 성공 시 데이터 필드에 성공 메시지 혹은 null을 담아 반환
            return ResponseEntity.ok(CommonResponse.success("임시 비밀번호가 메일로 발송되었습니다."));
        } catch (RuntimeException e) {
            // 비즈니스 로직 에러 (사용자 없음 등)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponse.error(e.getMessage()));
        } catch (Exception e) {
            // 예상치 못한 시스템 서버 에러
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CommonResponse.error("서버 내부 오류가 발생했습니다."));
        }
    }

}
