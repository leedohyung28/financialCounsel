package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.LoginResponse;
import com.example.financialcounsel.service.ClientService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/searchList")
    public List<ClientVO> selectListClient(@RequestBody ClientVO formObject) {
        return clientService.selectListClient(formObject);
    }

    @PostMapping("/search")
    public ClientVO selectSingleClient(@RequestBody ClientVO formObject) {
        return clientService.selectSingleClient(formObject);
    }

    @PostMapping("/search/email")
    public LoginResponse selectSingleClientByEmail(@RequestBody ClientVO formObject) {
        return clientService.selectSingleClientByEmail(formObject);
    }
    @PostMapping("/login")
    public LoginResponse loginClient(@RequestBody ClientVO formObject) {
        return clientService.loginClient(formObject);
    }
}