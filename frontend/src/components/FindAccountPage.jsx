import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import PhoneAuth from "./common/PhoneAuth";
import { formatTime, handleVerifyOtp } from "../services/PhoneAuth";
// 필요하다면 PhoneCertify.css도 import (signup 때 쓴 스타일 재사용)

export default function FindAccountPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  // 단계 관리: 1(아이디 입력) -> 2(전화번호 인증) -> 3(완료)
  const [step, setStep] = useState(1);

  // 폼 데이터
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // 인증 관련 상태
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(180);

  // 타이머 로직 (SignUpPage와 동일)
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const onPhoneChange = (e) => {
    const { name, value } = e.target;
    setPhone((prev) => ({ ...prev, [name]: value }));
  };

  const onOtpChange = (e) => {
    const { name, value } = e.target;
    setOtp((prev) => ({ ...prev, [name]: value }));
  };

  // 1단계 -> 2단계 이동
  const handleCheckUser = () => {
    if (!userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    // TODO: 서버에 아이디 존재 여부 확인 로직
    console.log("아이디 확인:", userId);
    setStep(2);
  };

  // 인증번호 전송
  const handleSendOtp = () => {
    if (!phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    setIsOtpSent(true);
    setTimer(180);
    alert("인증번호가 발송되었습니다.");
  };

  // 인증 확인 -> 이메일 발송 -> 3단계 이동
  const handleVerifyAndSendEmail = () => {
    if (timer === 0) {
      alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      return;
    }
    if (otp !== "000000") {
      alert("인증번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 이메일 발송 API 호출
    console.log(`이메일 발송 요청: ${userId}, ${phone}`);
    setStep(3);
  };

  return (
    <div className={`root ${isDark ? "theme-dark" : "theme-light"}`}>
      {/* 테마 토글 (LoginPage와 동일) */}
      <div className="theme-toggle">
        <span className="toggle-label">
          {isDark ? "다크 모드" : "라이트 모드"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark((v) => !v)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="login-card">
        {step === 3 ? (
          /* STEP 3: 완료 화면 */
          <div className="signup-complete-content">
            <h1 className="title-main" style={{ marginBottom: "16px" }}>
              이메일 발송 완료
            </h1>
            <p className="complete-message">
              <strong>{userId}</strong>로 계정 복구 메일을 보냈습니다.
              <br />
              메일함을 확인해주세요.
            </p>
            <div
              className="actions-bottom"
              style={{ justifyContent: "flex-end" }}
            >
              <button
                className="primary-btn"
                onClick={() => navigate("../LoginPage")}
              >
                로그인으로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1 & 2: 입력 폼 */
          <>
            <div className="title-area">
              <h1 className="title-main">계정 찾기</h1>
              <div className="title-sub">
                {step === 1
                  ? "아이디를 입력해주세요"
                  : "본인 확인을 위해 전화번호를 인증해주세요"}
              </div>
            </div>

            <div className="input-area">
              {step === 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label className="field-label">아이디</label>
                    <input
                      className="field-input"
                      style={{ width: "100%" }}
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="example@domain.com"
                    />
                  </div>
                  {/* 아이디 확인 버튼 */}
                  <button className="primary-btn" onClick={handleCheckUser}>
                    확인
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="auth-form">
                  {/* 아이디 표시 (읽기 전용) */}
                  <div className="field-group">
                    <label className="field-label">아이디</label>
                    <input
                      className="field-input"
                      value={userId}
                      disabled
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                  <PhoneAuth
                    phone={phone}
                    otp={otp}
                    onPhoneChange={onPhoneChange}
                    onOtpChange={onOtpChange}
                    isOtpSent={isOtpSent}
                    handleSendOtp={handleSendOtp}
                    handleVerifyOtp={handleVerifyOtp(
                      timer,
                      otp,
                      setIsCompleted
                    )}
                    timer={timer}
                    formatTime={formatTime}
                  />
                </div>
              )}
            </div>

            <div
              className="actions-bottom"
              style={{ justifyContent: "space-between" }}
            >
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  if (step === 2) setStep(1);
                  else navigate("../LoginPage");
                }}
              >
                {step === 2 ? "이전으로" : "취소"}
              </button>

              {step === 2 && (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleVerifyAndSendEmail}
                >
                  이메일 발송
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer는 LoginPage와 동일하게 */}
      <footer className="footer">{/* ... 생략 (LoginPage 복사) */}</footer>
    </div>
  );
}
