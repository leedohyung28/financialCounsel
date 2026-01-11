package com.example.financialcounsel.service;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.ClientResponse;
import com.example.financialcounsel.dto.client.LoginResponse;
import com.example.financialcounsel.global.utils.CommonEntityUtils;
import com.example.financialcounsel.global.utils.EncryptUtils;
import com.example.financialcounsel.global.utils.ImageUtils;
import com.example.financialcounsel.global.utils.ValidationUtils;
import com.example.financialcounsel.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {
    private final ClientRepository clientRepository;

    public List<ClientVO> selectListClient(ClientVO clientVO) {
        return clientRepository.findAll();
    }

    /**
     * 직원 단건 조회
     * @param clientVO 조회 할 직원의 ID
     * @return ClientVO 객체
     */
    @Transactional(readOnly = true)
    public ClientResponse selectSingleClient(ClientVO clientVO) {
        // InputVO 검증
        // 직원ID 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("email"), "조회");

        ClientVO entity = clientRepository.findByEmail(clientVO.getEmail())
                .orElseThrow(() -> new RuntimeException("해당 이메일의 직원을 찾을 수 없습니다."));

        return ClientResponse.from(entity);
    }

    /**
     * 직원 단건 조회 (이메일)
     * @param clientVO 조회 할 직원의 ID
     * @return ClientVO 객체
     */
    @Transactional(readOnly = true)
    public LoginResponse selectSingleClientByEmail(ClientVO clientVO) {
        // InputVO, 직원이메일 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("email"), "조회");

        return clientRepository.findByEmail(clientVO.getEmail())
                .map(found -> {
                        // [코드 0] Client 확인
                        return LoginResponse.of(0, "client found");
                })
                // [코드 9] Client 실패
                .orElseGet(() -> LoginResponse.of(9, "존재하지 않는 이메일입니다."));
    }

    /**
     * 직원 단건 조회 (OTP)
     * @param clientVO 조회 할 직원의 ID
     * @return ClientVO 객체
     */
    @Transactional(readOnly = true)
    public String selectClientOtp(ClientVO clientVO) {
        // InputVO 검증
        // 직원ID 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("email"), "조회");

        ClientVO entity = clientRepository.findByEmail(clientVO.getEmail())
                .orElseThrow(() -> new RuntimeException("해당 이메일의 직원을 찾을 수 없습니다."));

        return entity.getSecretOtpKey();
    }

    /**
     * 이메일 중복 검증
     * @param clientVO 조회 할 직원의 ID
     * @return ClientVO 객체
     */
    @Transactional(readOnly = true)
    public LoginResponse validDuplicateEmail(ClientVO clientVO) {
        // InputVO, 직원이메일 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("email"), "조회");

        return clientRepository.findByEmail(clientVO.getEmail())
                .map(found -> {
                    // [코드 0] Client 확인
                    return LoginResponse.of(9, "이미 존재하는 이메일");
                })
                // [코드 9] Client 실패
                .orElseGet(() -> LoginResponse.of(0, "Valid Success"));
    }

    /**
     * 직원 로그인 확인
     * @param clientVO 조회 할 직원의 ID
     * @return 결과 코드와 메시지를 포함한 Map
     */
    @Transactional(readOnly = true)
    public LoginResponse loginClient(ClientVO clientVO) {
        // InputVO, 직원ID, 비밀번호 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("email", "password"), "조회");

        // 비밀번호 암호화
        String encryptedInputPassword = EncryptUtils.encryptPassword(clientVO.getPassword());

        return clientRepository.findByEmail(clientVO.getEmail())
                .map(found -> {
                    if (found.getPassword().equals(encryptedInputPassword)) {
                        // [코드 0] 로그인 성공
                        return LoginResponse.of(0, "login success");
                    } else {
                        // [코드 1] 이메일은 있지만 비밀번호가 다른 경우
                        return LoginResponse.of(1, "로그인에 실패했습니다.");
                    }
                })
                // [코드 9] 해당하는 email이 존재하지 않는 경우
                .orElseGet(() -> LoginResponse.of(9, "존재하지 않는 이메일입니다."));
    }

    /**
     *
     * 직원 등록 (Insert)
     * @param clientVO 객체
     * @return ClientVO 객체
     */
    public ClientVO insertClient(ClientVO clientVO) {
        // 직원명 필수 입력 검증
        ValidationUtils.validateNonNullFields(clientVO, "등록");
        // 비밀번호 암호화 및 설정
        String encryptedInputPassword = EncryptUtils.encryptPassword(clientVO.getPassword());
        clientVO.setPassword(encryptedInputPassword);

        // 이미지를 byte로 변환
        byte[] imageBytes = ImageUtils.convertToBytes(clientVO.getImage());
        clientVO.setProfileImage(imageBytes);

        // 직원 등록은 항상 사용 가능하도록 설정
        clientVO.setUseYn(Boolean.TRUE);

        CommonEntityUtils.commonCreateFunc(clientVO);

        return clientRepository.save(clientVO);
    }

    /**
     *
     * 직원 수정 (Update)
     * @param clientVO 객체
     * @return ClientVO 객체
     */
    public ClientVO updateClient(ClientVO clientVO) {
        ValidationUtils.validateNonNullFields(clientVO, "수정");
        // 직원명 필수 입력 검증
        // 비밀번호 암호화 및 설정
        String encryptedInputPassword = EncryptUtils.encryptPassword(clientVO.getPassword());
        clientVO.setPassword(encryptedInputPassword);
        // 직원 등록은 항상 사용 가능하도록 설정
        clientVO.setUseYn(Boolean.TRUE);

        return clientRepository.findById(clientVO.getId()).map(existingClient -> {
            existingClient.setName(clientVO.getName());
            existingClient.setEmail(clientVO.getEmail());
            if(clientVO.getPassword() != null) {
                existingClient.setPassword(EncryptUtils.encryptPassword(clientVO.getPassword()));
            }
            return clientRepository.save(existingClient);
        }).orElseThrow(() -> new RuntimeException("수정할 직원 정보를 찾을 수 없습니다."));
    }

    /**
     *
     * 직원 수정 (Update)
     * @param clientVO 객체
     * @return ClientVO 객체
     */
    public ClientVO updateClientOtpSecretKey(ClientVO clientVO) {
        // 직원명, OTP 시크릿 키 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("email", "secretOtpKey"), "수정");

        return clientRepository.findByEmail(clientVO.getEmail()).map(existingClient -> {
            return clientRepository.save(existingClient);
        }).orElseThrow(() -> new RuntimeException("OTP를 설정할 직원 정보를 찾을 수 없습니다."));
    }

    /**
     *
     * 직원 삭제 (Delete)
     * @param clientVO 객체
     * @return ClientVO 객체
     */
    public ClientVO deleteClient(ClientVO clientVO) {
        // InputVO 검증
        Assert.notNull(clientVO, "삭제할 직원 정보가 없습니다.");

        // 직원ID 필수 입력 검증
        Assert.hasText(clientVO.getId(), "삭제할 ID는 필수 값입니다.");

        return clientRepository.findById(clientVO.getId()).map(deletedClient -> {
            if (Boolean.FALSE.equals(deletedClient.getUseYn())) {
                throw new RuntimeException("이미 삭제 처리된 직원입니다.");
            }
            deletedClient.setUseYn(Boolean.FALSE);
            return clientRepository.save(deletedClient);
        }).orElseThrow(() -> new RuntimeException("삭제할 직원을 찾을 수 없습니다."));
    }
}