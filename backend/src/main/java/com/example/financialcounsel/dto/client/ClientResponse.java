package com.example.financialcounsel.dto.client;

import com.example.financialcounsel.domain.ClientVO;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public class ClientResponse {
    private String id;
    private String name;
    private String email;
    private String phoneNum;
    private String sex;
    private Date birthday;
    private String location;
    private String nickname;
    private byte[] profileImage;

    // VO를 DTO로 변환하는 생성자 (정적 팩토리 메서드 방식)
    public static ClientResponse from(ClientVO clientVO) {
        ClientResponse response = new ClientResponse();
        response.id = clientVO.getId();
        response.name = clientVO.getName();
        response.email = clientVO.getEmail();
        response.phoneNum = clientVO.getPhoneNum();
        response.sex = clientVO.getSex();
        response.birthday = clientVO.getBirthday();
        response.location = clientVO.getLocation();
        response.nickname = clientVO.getNickname();
        response.profileImage = clientVO.getProfileImage();
        return response;
    }
}
