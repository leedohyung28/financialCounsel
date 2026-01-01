package com.example.financialcounsel.global.utils;

import com.example.financialcounsel.global.annotation.DomainName;
import com.example.financialcounsel.global.annotation.FieldName;
import lombok.NonNull;
import org.springframework.util.Assert;

import java.lang.reflect.Field;

public class ValidationUtils {

    /**
     * @param target 검증할 VO 객체
     * @param action "입력", "수정", "삭제" 등 메시지에 포함될 행위
     */
    public static void validateNonNullFields(Object target, String action) {
        // TODO : ID만 검증할 것인지 + 수정의 경우 어떻게 할 것인지 항목 추가 등 고려 필요...

        // 클래스 레벨의 @DomainName 정보 추출 (없다면 Domain명)
        Class<?> targetClass = target.getClass();
        String domainDisplayName = targetClass.isAnnotationPresent(DomainName.class)
                ? targetClass.getAnnotation(DomainName.class).value()
                : targetClass.getSimpleName();

        // 검증할 VO 존재 여부 확인
        String targetNullMessage = String.format("%s할 %s가 없습니다.", action, domainDisplayName);
        Assert.notNull(target, targetNullMessage);

        Field[] fields = target.getClass().getDeclaredFields();

        for (Field field : fields) {
            // @NonNull 어노테이션 확인
            if (field.isAnnotationPresent(NonNull.class)) {
                field.setAccessible(true); // private 필드 접근 허용

                try {
                    Object value = field.get(target);

                    // @FieldName에서 한글명 추출 (없다면 필드명)
                    String fieldDisplayName = field.isAnnotationPresent(FieldName.class)
                            ? field.getAnnotation(FieldName.class).value()
                            : field.getName();

                    // 검증 수행
                    String message = String.format("%s할 %s는 필수 값입니다.", action, fieldDisplayName);
                    Assert.notNull(value, message);

                    // 만약 String 타입이면 빈 문자열("") 체크도 추가하고 싶을 때
                    if (value instanceof String) {
                        String messageString = String.format("%s할 %s는 문자열로 이루어져 있어야합니다.", action, fieldDisplayName);
                        Assert.hasText((String) value, messageString);
                    }
                    // TODO : 다른 속성 값(Boolean, Timestamp)에 대한 고려도 필요
                    // TODO : 공통 속성 여부 체크 (YN 속성 추가 등등...)

                } catch (IllegalAccessException e) {
                    throw new RuntimeException("필드 접근 중 오류 발생", e);
                }
            }
        }
    }
}
