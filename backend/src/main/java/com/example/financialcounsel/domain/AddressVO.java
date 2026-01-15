package com.example.financialcounsel.domain;

import com.example.financialcounsel.global.annotation.DomainName;
import com.example.financialcounsel.global.annotation.FieldName;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "address")
@Data
@NoArgsConstructor
@DomainName("주소정보")
public class AddressVO {
    @Id
    private String id;

    @Getter
    @Setter
    @NonNull
    @FieldName("도로명주소관리번호")
    @Field("road_addr_id")
    private String roadAddrId;

    @Getter
    @Setter
    @NonNull
    @FieldName("법정동코드")
    @Field("bjdong_code")
    private String bjdongCode;

    @Getter
    @Setter
    @FieldName("시도명")
    private String sido;

    @Getter
    @Setter
    @FieldName("시군구명")
    private String sigungu;

    @Getter
    @Setter
    @FieldName("법정읍면동명")
    private String eupmyeondong;

    @Getter
    @Setter
    @FieldName("법정리명")
    private String ri;

    @Getter
    @Setter
    @FieldName("산여부")
    @Field("is_mountain")
    private String isMountain; // 0:대지, 1:산

    @Getter
    @Setter
    @FieldName("지번본번")
    @Field("jibun_main")
    private Integer jibunMain;

    @Getter
    @Setter
    @FieldName("지번부번")
    @Field("jibun_sub")
    private Integer jibunSub;

    @Getter
    @Setter
    @FieldName("도로명코드")
    @Field("road_code")
    private String roadCode;

    @Getter
    @Setter
    @FieldName("지하여부")
    @Field("is_underground")
    private String isUnderground;

    @Getter
    @Setter
    @FieldName("건물본번")
    @Field("build_main")
    private Integer buildMain;

    @Getter
    @Setter
    @FieldName("건물부번")
    @Field("build_sub")
    private Integer buildSub;

    @Getter
    @Setter
    @FieldName("이동사유코드")
    @Field("move_reason_code")
    private String moveReasonCode;

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

    /**
     * 가이드 문서의 표기 규칙을 적용한 전체 주소 생성 메서드
     */
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        sb.append(sido).append(" ").append(sigungu).append(" ");

        if (eupmyeondong != null && !eupmyeondong.isEmpty()) {
            sb.append(eupmyeondong);
        }

        if (ri != null && !ri.isEmpty()) {
            sb.append(" ").append(ri);
        }

        // 산 여부 처리
        if ("1".equals(isMountain)) {
            sb.append(" 산");
        } else {
            sb.append(" ");
        }

        // 지번 처리 (부번이 0이면 생략)
        sb.append(jibunMain);
        if (jibunSub != null && jibunSub > 0) {
            sb.append("-").append(jibunSub);
        }

        return sb.toString().replaceAll("\\s+", " ").trim();
    }
}