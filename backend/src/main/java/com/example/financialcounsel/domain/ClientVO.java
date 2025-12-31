package com.example.financialcounsel.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;

@Document(collection = "client")
@Data
@NoArgsConstructor
public class ClientVO {
    @Id
    private String id;
    
    // 직원명
    @Setter
    @Getter
    @NonNull
    private String name;
    
    // 이메일
    @Getter
    @Setter
    @NonNull
    private String email;
    
    // 패스워드
    @Getter
    @Setter
    @NonNull
    private String password;
    
    // 휴대폰 번호
    @Getter
    @Setter
    @NonNull
    private String phoneNum;

    // 성별
    @Getter
    @Setter
    private String sex;

    // 위치
    @Getter
    @Setter
    private String location;

    // 별명
    @Getter
    @Setter
    private String nickname;

    // 프로필사진
    @Getter
    @Setter
    private String profileImage;

    // 사용여부
    @Getter
    @Setter
    private Boolean useYn;

    // 생성 일시
    @Setter
    @NonNull
    private Timestamp createdAt;

    // 생성자 ID
    @Setter
    @NonNull
    private String createdId;

    // 수정 일시
    @Setter
    @NonNull
    private Timestamp updatedAt;

    // 수정자 ID
    @Setter
    @NonNull
    private String updatedId;
}
