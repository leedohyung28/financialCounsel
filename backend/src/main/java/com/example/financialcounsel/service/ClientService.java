package com.example.financialcounsel.service;

import com.example.financialcounsel.domain.ClientVO;
import com.example.financialcounsel.dto.client.LoginResponse;
import com.example.financialcounsel.global.utils.EncryptUtils;
import com.example.financialcounsel.global.utils.ValidationUtils;
import com.example.financialcounsel.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.*;

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
    public ClientVO selectSingleClient(ClientVO clientVO) {
        // InputVO 검증
        // 직원ID 필수 입력 검증
        ValidationUtils.validateSelectedFields(clientVO, List.of("id"), "조회");

        return clientRepository.findById(clientVO.getId()).orElse(null);
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
        // InputVO 검증
//        Assert.notNull(clientVO, "조회할 직원 정보가 없습니다.");

        // 직원명 필수 입력 검증
        ValidationUtils.validateNonNullFields(clientVO, "등록");

        // TODO : 이메일 중복 여부 확인 메서드
        
        // TODO : 비밀번호 Enc 관련 메서드
        
        // TODO : 생성/수정 필수 체크 메서드

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

//        // InputVO 검증
//        Assert.notNull(clientVO, "수정할 직원 정보가 없습니다.");
//
//        // 직원ID 필수 입력 검증
//        Assert.hasText(clientVO.getId(), "수정할 ID는 필수 값입니다.");
//
//        // 직원명 필수 입력 검증
//        // TODO : NonNull 추출해서 필수 확인 할 수 있지 않을까..?
//
//        Assert.hasText(clientVO.getName(), "수정할 ID는 필수 값입니다.");
//        Assert.hasText(clientVO.getEmail(), "수정할 이메일는 필수 값입니다.");
//        Assert.hasText(clientVO.getPassword(), "수정할 패스워드는 필수 값입니다.");

        // TODO : 이메일 중복 여부 확인 메서드

        // TODO : 비밀번호 Enc 관련 메서드

        // TODO : 생성/수정 필수 체크 메서드

        return clientRepository.findById(clientVO.getId()).map(existingClient -> {
            // TODO : 수정 필요
            existingClient.setName(clientVO.getName());
            existingClient.setEmail(clientVO.getEmail());
            return clientRepository.save(existingClient);
        }).orElseThrow(() -> new RuntimeException("수정 직원 없음"));
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
                throw new RuntimeException("이미 삭제된 직원");
            }

            deletedClient.setUseYn(Boolean.FALSE);

            // TODO : 수정일시 직원 적용

            return clientRepository.save(deletedClient);
        }).orElseThrow(() -> new RuntimeException("삭제 직원 없음"));
    }


}