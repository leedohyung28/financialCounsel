package com.example.financialcounsel.service;

import com.example.financialcounsel.domain.Address;
import com.example.financialcounsel.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;

    public List<Address> selectListAddress(Address formObject) {
        List<Address> addressList = new ArrayList<>();

//        if (formObject.getInputKeyword() != null) {
//            throw new Exception("InputKeyword 존재하지 않음");
//        }

        return addressList;
    }
}