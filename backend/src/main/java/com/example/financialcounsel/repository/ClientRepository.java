package com.example.financialcounsel.repository;

import com.example.financialcounsel.domain.ClientVO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

@org.springframework.stereotype.Repository
public interface ClientRepository extends MongoRepository<ClientVO, String> {

    /**
     * 직원 목록 조회
     */
    List<ClientVO> selectListClient(ClientVO clientVO);

    /**
     * 직원 추가
     */
    int insertClient(ClientVO clientVO);

    /**
     * 직원 수정
     */
    int updateClient(ClientVO clientVO);

    /**
     * 직원 삭제
     */
    int deleteClient(ClientVO clientVO);
}