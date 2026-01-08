package com.example.financialcounsel.global.utils;

import com.example.financialcounsel.domain.ClientVO;
import java.sql.Timestamp;
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
}