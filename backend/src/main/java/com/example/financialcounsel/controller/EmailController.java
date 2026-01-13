package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/temp")
    public ResponseEntity<?> sendTemporaryPassword(@RequestBody ClientVO clientVO) {
        try {
            emailService.sendTemporaryPassword(clientVO);
            // 성공 시 200 OK와 메시지 반환
            return ResponseEntity.ok(Map.of("message", "임시 비밀번호가 메일로 발송되었습니다."));
        } catch (RuntimeException e) {
            // 서비스에서 던진 RuntimeException 등을 캐치하여 400 에러 반환
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // 예상치 못한 시스템 에러는 500 에러 반환
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 내부 오류가 발생했습니다."));
        }
    }

}
