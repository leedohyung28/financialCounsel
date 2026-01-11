package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.ClientResponse;
import com.example.financialcounsel.dto.client.LoginResponse;
import com.example.financialcounsel.global.common.CommonResponse;
import com.example.financialcounsel.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    @PostMapping("/searchList")
    public ResponseEntity<CommonResponse<List<ClientVO>>> selectListClient(@RequestBody ClientVO formObject) {
        List<ClientVO> list = clientService.selectListClient(formObject);
        return ResponseEntity.ok(CommonResponse.success(list));
    }

    /**
     * 직원 단건 조회
     */
    @PostMapping("/search")
    public ResponseEntity<CommonResponse<ClientResponse>> selectSingleClient(@RequestBody ClientVO formObject) {
        ClientResponse client = clientService.selectSingleClient(formObject);
        return ResponseEntity.ok(CommonResponse.success(client));
    }

    /**
     * 직원 단건 조회 (이메일)
     */
    @PostMapping("/search/email")
    public ResponseEntity<CommonResponse<LoginResponse>> selectSingleClientByEmail(@RequestBody ClientVO formObject) {
        LoginResponse response = clientService.selectSingleClientByEmail(formObject);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    /**
     * 이메일 중복 검증
     */
    @PostMapping("/valid/email")
    public ResponseEntity<CommonResponse<LoginResponse>> validDuplicateEmail(@RequestBody ClientVO formObject) {
        LoginResponse response = clientService.validDuplicateEmail(formObject);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    /**
     * 직원 로그인 확인
     */
    @PostMapping("/login")
    public ResponseEntity<CommonResponse<LoginResponse>> loginClient(@RequestBody ClientVO formObject) {
        LoginResponse response = clientService.loginClient(formObject);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    /**
     * 직원 등록
     */
    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CommonResponse<ClientVO>> insertClient(@ModelAttribute ClientVO formObject) {
        try {
            // MultipartFile로 들어온 데이터를 byte[]로 변환하는 작업은 Service에서 수행
            ClientVO savedClient = clientService.insertClient(formObject);
            return ResponseEntity.ok(CommonResponse.success(savedClient));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(CommonResponse.error(e.getMessage()));
        }
    }
}
