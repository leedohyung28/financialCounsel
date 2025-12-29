package com.example.financialcounsel.repository;

import com.example.financialcounsel.domain.AddressVO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

@org.springframework.stereotype.Repository
public interface AddressRepository extends MongoRepository<AddressVO, String> {
    List<AddressVO> selectListAddress(AddressVO addressVO);
}