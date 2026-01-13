package com.example.financialcounsel.global.utils;

import com.example.financialcounsel.domain.ClientVO;

import java.lang.reflect.Field;
import java.util.Date;

public class CommonEntityUtils {

    /**
     * 신규 등록 시 공통 필드 설정 (Create)
     */
    public static void commonCreateFunc(ClientVO vo) {
        String currentId = SessionUtils.getCurrentUserId();
        Date now = new Date(System.currentTimeMillis());

        vo.setCreatedAt(now);
        vo.setCreatedId(currentId);
        vo.setUpdatedAt(now);
        vo.setUpdatedId(currentId);
    }

    /**
     * 수정 시 공통 필드 설정 (Update)
     */
    public static void commonUpdateFunc(ClientVO vo) {
        String currentId = SessionUtils.getCurrentUserId();
        Date now = new Date(System.currentTimeMillis());

        vo.setUpdatedAt(now);
        vo.setUpdatedId(currentId);
    }

    /**
     * 빈 문자열이나 Null이 아닐 때 복사
     */
    public static void copyUnEmptyProperties(Object source, Object target) {
        if (source == null || target == null) return;

        Field[] fields = source.getClass().getDeclaredFields();

        for (Field field : fields) {
            field.setAccessible(true); // private 필드 접근 허용
            try {
                Object value = field.get(source);

                if (value != null) {
                    if (value instanceof String && ((String) value).trim().isEmpty()) {
                        continue;
                    }
                    field.set(target, value);
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException("필드 업데이트 중 오류 발생: " + field.getName(), e);
            }
        }
    }
}