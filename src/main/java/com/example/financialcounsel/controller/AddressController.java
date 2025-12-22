package com.example.financialcounsel.controller;

import com.example.financialcounsel.domain.Address;
import com.example.financialcounsel.service.AddressService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public List<Address> selectListAddress(Address formObject) {
        List<Address> listAddress = addressService.selectListAddress(formObject);
        return listAddress;
    }
}
