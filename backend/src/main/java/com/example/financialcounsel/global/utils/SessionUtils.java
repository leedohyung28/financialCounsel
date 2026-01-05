package com.example.financialcounsel.global.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class SessionUtils {
    /**
     * 현재 세션에 저장된 사용자 ID 반환
     */
    public static String getCurrentUserId() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            HttpSession session = request.getSession(false);
            if (session != null) {
                // 세션에 저장된 키값(예: "userId")에 맞춰 수정하세요.
                Object userId = session.getAttribute("userId");
                return userId != null ? userId.toString() : "SYSTEM";
            }
        }
        return "SYSTEM"; // 세션이 없는 경우 기본값
    }
}