package com.example.financialcounsel.repository;

import com.example.financialcounsel.domain.ClientVO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface ClientRepository extends MongoRepository<ClientVO, String> {
    
    /**
     * 직원 단건 조회 (이메일)
     * @param email 조회 할 직원의 이메일
     * @return ClientVO 객체
     */
    Optional<ClientVO> findByEmail(String email);
}