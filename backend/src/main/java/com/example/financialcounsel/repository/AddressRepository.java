package com.example.financialcounsel.repository;

import com.example.financialcounsel.domain.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

@org.springframework.stereotype.Repository
public interface AddressRepository extends MongoRepository<Address, String> {
    List<Address> selectListAddress(Address formObject);
}