package com.example.financialcounsel.domain;

import com.example.financialcounsel.global.annotation.DomainName;
import com.example.financialcounsel.global.annotation.FieldName;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Date;

@Document(collection = "client")
@Data
@NoArgsConstructor
@DomainName("직원정보")
public class ClientVO {
    @Id
    private String id;

    @Setter
    @Getter
    @NonNull @FieldName("직원명")
    private String name;

    @Getter
    @Setter
    @NonNull @FieldName("이메일")
    private String email;

    @Getter
    @Setter
    @NonNull @FieldName("패스워드")
    private String password;

    @Getter
    @Setter @FieldName("휴대폰 번호")
    private String phoneNum;

    @Getter
    @Setter @FieldName("성별")
    private String sex;

    @Getter
    @Setter @FieldName("생년월일")
    private Date birthday;

    @Getter
    @Setter @FieldName("위치")
    private String location;

    @Getter
    @Setter @FieldName("별명")
    private String nickname;

    @Getter
    @Setter @FieldName("프로필사진")
    @Transient
    private MultipartFile image;

    @Getter
    @Setter @FieldName("프로필사진")
    private byte[] profileImage;

    @Getter
    @Setter
    @NonNull @FieldName("사용여부")
    private Boolean useYn;

    @Getter
    @Setter
    @NonNull @FieldName("OTP 시크릿 키")
    private String secretOtpKey;

    @Setter
    @NonNull @FieldName("생성 일시")
    private Date createdAt;

    @Setter
    @NonNull @FieldName("생성자 ID")
    private String createdId;

    @Setter
    @NonNull @FieldName("수정 일시")
    private Date updatedAt;

    @Setter
    @NonNull @FieldName("수정자 ID")
    private String updatedId;
}
