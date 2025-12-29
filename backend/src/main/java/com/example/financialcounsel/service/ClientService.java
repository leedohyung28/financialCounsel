package com.example.financialcounsel.service;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {
    private final ClientRepository clientRepository;

    public List<ClientVO> selectListClient(ClientVO clientVO) {
        List<ClientVO> clientList = new ArrayList<>();

        return clientList;
    }
}