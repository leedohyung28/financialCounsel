package com.example.financialcounsel.service;

import com.example.financialcounsel.domain.ClientVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final ClientService clientService;

    /**
     *
     * 임시 비밀번호 발송
     *
     * @param clientVO 객체
     */
    @Transactional
    public void sendTemporaryPassword(ClientVO clientVO) {
        if (0 != clientService.selectSingleClientByEmail(clientVO).getResultCode()) {
            throw new RuntimeException("해당 이메일의 직원을 찾을 수 없습니다.");
        }

        String email = clientVO.getEmail();

        // 12자리 임시 비밀번호
        String tmpPwd = UUID.randomUUID().toString().substring(0, 12);
        clientVO.setPassword(tmpPwd);

        try {
            // 메일 발송
            sendMail(email, tmpPwd);

            // DB에 비밀번호 업데이트
            clientService.updateClientPassword(clientVO);
        } catch (MailException e) {
            // 3. 발송 실패 시 예외를 던져 전체 로직 중단
            log.error("메일 발송 실패: {}", e.getMessage());
            throw new RuntimeException("이메일 발송에 실패하여 비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    /**
     *
     * 메일 발송
     *
     * @param email 이메일, tmpPwd 임시 비밀번호
     */
    @Async
    @Retryable(value = {MailException.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void sendMail(String email, String tmpPwd) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[서비스명] 임시 비밀번호 안내입니다.");
        message.setText("안녕하세요. 요청하신 임시 비밀번호는 [" + tmpPwd + "] 입니다.\n" +
                "로그인 후 반드시 비밀번호를 변경해주세요.");

        mailSender.send(message);
    }

    @Recover
    public void recover(MailException e, String email, String tempPassword) {
        log.error("3회 재시도 모두 실패: {}", email);
        // 필요시 관리자 알림 혹은 로그 적재
    }
}
