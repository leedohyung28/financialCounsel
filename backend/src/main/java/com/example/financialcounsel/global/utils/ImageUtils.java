package com.example.financialcounsel.global.utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public class ImageUtils {

    /**
     * MultipartFile을 byte[]로 변환
     * @param profileImage 프론트에서 넘어온 파일 객체
     * @return 변환된 byte 배열 (파일이 없으면 null 반환)
     */
    public static byte[] convertToBytes(MultipartFile profileImage) {
        if (profileImage == null || profileImage.isEmpty()) {
            return null;
        }

        try {
            return profileImage.getBytes();
        } catch (IOException e) {
            // 로깅을 추가하거나 커스텀 예외를 던질 수 있습니다.
            throw new RuntimeException("이미지 파일을 바이트 배열로 변환하는 중 오류가 발생했습니다.", e);
        }
    }
}