package com.example.financialcounsel.service;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.OtpRegistrationResponse;
import com.example.financialcounsel.dto.client.OtpVerifyRequest;
import com.example.financialcounsel.global.utils.ValidationUtils;
import com.example.financialcounsel.repository.ClientRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class OtpService {

    private final GoogleAuthenticator gAuth;
    private final ClientService clientService;
    private final ClientRepository clientRepository;

    public OtpService(GoogleAuthenticator gAuth, ClientService clientService, ClientRepository clientRepository) {
        this.gAuth = gAuth;
        this.clientService = clientService;
        this.clientRepository = clientRepository;
    }

    /**
     * 시크릿키 존재 여부 확인
     * @param clientVO 조회 할 직원의 ID
     * @return boolean 객체
     */
    @Transactional
    public boolean validSecretKey(ClientVO clientVO) {
        ClientVO client = clientRepository.findByEmail(clientVO.getEmail())
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 계정을 찾을 수 없습니다: " + clientVO.getEmail()));

        return StringUtils.hasText(client.getSecretOtpKey());
    }

    /**
     * OTP 시크릿 생성
     * @param clientVO 조회 할 직원의 ID
     * @return OtpRegistrationResponse 객체
     */
    @Transactional
    public OtpRegistrationResponse generateSecret(ClientVO clientVO, HttpSession session) {

        try {
            final GoogleAuthenticatorKey key = gAuth.createCredentials();
            clientVO.setSecretOtpKey(key.getKey());

            String email = clientVO.getEmail();
            String secretKey = key.getKey();

            session.setMaxInactiveInterval(3 * 60);
            session.setAttribute("OTP_KEY_" + email, secretKey);

            String otpAuthUrl = String.format(
                    "otpauth://totp/MyFinancialApp:%s?secret=%s&issuer=MyFinancialApp",
                    clientVO.getEmail(),
                    secretKey
            );
            return new OtpRegistrationResponse(secretKey, otpAuthUrl);
        } catch (Exception e) {
            throw new RuntimeException(e.toString());
        }
    }

    /**
     * OTP 코드 인증 (초기)
     * @param otpVerifyRequest 조회 할 직원의 ID
     * @return OtpRegistrationResponse 객체
     */
    public boolean verifyInitCode(OtpVerifyRequest otpVerifyRequest, HttpSession session) {
        ValidationUtils.validateSelectedFields(otpVerifyRequest, List.of("email", "code"), "인증");

        String email = otpVerifyRequest.getEmail();

        String sessionKey = "OTP_KEY_" + email;
        String secret = (String) session.getAttribute(sessionKey);
        session.removeAttribute(sessionKey);

        if (secret == null) {
            throw new RuntimeException("OTP 시크릿키가 존재하지 않습니다. 다시 회원가입을 진행해주세요.");
        }

        int code = otpVerifyRequest.getCode();
        return gAuth.authorize(secret, code);
    }

    /**
     * OTP 코드 인증
     * @param otpVerifyRequest 조회 할 직원의 ID
     * @return OtpRegistrationResponse 객체
     */
    public boolean verifyCode(OtpVerifyRequest otpVerifyRequest, HttpSession session) {
        ValidationUtils.validateSelectedFields(otpVerifyRequest, List.of("email", "code"), "인증");

        String email = otpVerifyRequest.getEmail();
        ClientVO client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 계정을 찾을 수 없습니다."));

       String secret = client.getSecretOtpKey();

        if (secret.isBlank()) {
            throw new RuntimeException("OTP 시크릿키가 존재하지 않습니다. 다시 회원가입을 진행해주세요.");
        }

        int code = otpVerifyRequest.getCode();
        return gAuth.authorize(secret, code);
    }

    /**
     * OTP 시크릿 키 재등록 및 검증 확정
     */
    @Transactional
    public void updateOtpSecretKey(OtpVerifyRequest otpVerifyRequest) {
        ValidationUtils.validateSelectedFields(otpVerifyRequest, List.of("email", "secretKey", "code"), "OTP 재등록");

        ClientVO client = clientRepository.findByEmail(otpVerifyRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 계정을 찾을 수 없습니다: " + otpVerifyRequest.getEmail()));

        boolean isValid = gAuth.authorize(otpVerifyRequest.getSecretKey(), otpVerifyRequest.getCode());

        if (!isValid) {
            throw new RuntimeException("인증 코드가 일치하지 않습니다. QR 코드를 다시 스캔해주세요.");
        }

        // 4. 검증 성공 시에만 새로운 시크릿 키를 DB에 반영
        try {
            client.setSecretOtpKey(otpVerifyRequest.getSecretKey());
            clientRepository.save(client);
        } catch (Exception e) {
            throw new RuntimeException("보안 키 업데이트 처리 중 서버 오류가 발생했습니다.", e);
        }
    }
}
