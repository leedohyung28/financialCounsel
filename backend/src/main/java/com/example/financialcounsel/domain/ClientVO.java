package com.example.financialcounsel.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.sql.Timestamp;

@Data
public class ClientVO {
    @Id
    private String id;
    
    // 직원명
    private String name;
    
    // 이메일
    private String email;
    
    // 패스워드
    private String password;
    
    // 휴대폰 번호
    private String phoneNum;

    // 성별
    private String sex;

    // 위치
    private String location;

    // 별명
    private String nickname;

    // 프로필사진
    private String profileImage;

    // 사용여부
    private Boolean useYn;

    // 생성 일시
    private Timestamp createdAt;

    // 생성자 ID
    private String createdId;

    // 수정 일시
    private Timestamp updatedAt;

    // 수정자 ID
    private String updatedId;
}
