package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.LoginResponse;
import com.example.financialcounsel.global.common.CommonResponse;
import com.example.financialcounsel.service.ClientService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/searchList")
    public ResponseEntity<CommonResponse<List<ClientVO>>> selectListClient(@RequestBody ClientVO formObject) {
        List<ClientVO> list = clientService.selectListClient(formObject);
        return ResponseEntity.ok(CommonResponse.success(list));
    }

    @PostMapping("/search")
    public ResponseEntity<CommonResponse<ClientVO>> selectSingleClient(@RequestBody ClientVO formObject) {
        ClientVO client = clientService.selectSingleClient(formObject);
        return ResponseEntity.ok(CommonResponse.success(client));
    }

    @PostMapping("/search/email")
    public ResponseEntity<CommonResponse<LoginResponse>> selectSingleClientByEmail(@RequestBody ClientVO formObject) {
        LoginResponse response = clientService.selectSingleClientByEmail(formObject);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @PostMapping("/login")
    public ResponseEntity<CommonResponse<LoginResponse>> loginClient(@RequestBody ClientVO formObject) {
        LoginResponse response = clientService.loginClient(formObject);
        // 로그인 로직 내부에 이미 성공/실패 코드가 있으므로 데이터로 담아 보냅니다.
        return ResponseEntity.ok(CommonResponse.success(response));
    }

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
