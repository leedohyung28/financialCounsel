import React, { useState } from "react";
import "../styles/LoginPage.css";
import "../styles/PasswordPage.css";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../hooks/useNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { setSession } from "../utils/session";
import { clientApi } from "../api/clientApi";
import OtpSetup from "./common/OtpSetup";

export default function LoginPage() {
  const { goToFindAccount, goToSignUp, goToAddressHome } = useNavigation();
  const { isDark, toggleTheme } = useTheme();

  // 로그인 단계 관리 (1: 이메일, 2: 비밀번호)
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // OTP 상태 추가
  const [showPassword, setShowPassword] = useState(false);
  const [otpData, setOtpData] = useState({ secretKey: "", qrCodeUrl: "" });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  // OTP 재등록 시작 핸들러
  const handleResetOtp = async () => {
    const confirmReset = window.confirm(
      "현재 OTP가 삭제됩니다. 정말로 재등록 하시겠습니까?"
    );
    if (!confirmReset) return;

    setLoading(true);
    try {
      const response = await clientApi.setupOtp(email);
      if (response.success) {
        setOtpData({
          secretKey: response.data.secretKey,
          qrCodeUrl: response.data.qrCodeUrl,
        });
        setErrorMsg("");
        setIsError(false);
        setOtp(""); // 입력칸 초기화
        setStep(4); // 재등록 화면으로 이동
      }
    } catch (error) {
      triggerError("OTP 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // '다음' 또는 '로그인' 버튼 클릭 핸들러
  const handleNextStep = async () => {
    if (step === 1) {
      /* --- STEP 1: 이메일 확인 --- */
      if (!email.trim()) return alert("이메일을 입력해주세요.");

      setLoading(true);
      setErrorMsg("");
      try {
        const { success, data } = await clientApi.validId(email);
        if (success && data.resultCode === 0) setStep(2);
        else triggerError(data?.message || "계정을 찾을 수 없습니다.");
      } catch (error) {
        triggerError("이메일 확인 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      // --- STEP 2: 암호화 및 로그인 로직 ---
      if (!password.trim()) return triggerError("비밀번호를 입력해주세요.");

      setLoading(true);
      try {
        const result = await clientApi.loginClient(email, password);
        const { success, data } = result;

        if (success && data.resultCode === 0) {
          // 로그인 성공 시 바로 이동하지 않고 OTP 단계로 전환
          setStep(3);
          setErrorMsg("");
        } else {
          triggerError(data?.message || "로그인 정보가 올바르지 않습니다.");
        }
      } catch (error) {
        triggerError("로그인 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      /* --- STEP 3: OTP 인증 --- */
      if (otp.length !== 6)
        return triggerError("6자리 인증번호를 입력해주세요.");

      setLoading(true);
      try {
        // 기존 SignUp에서 사용했던 verifyOtp API 활용
        const response = await clientApi.verifyOtp(email, parseInt(otp));
        if (response.success) {
          setSession("userSession", email, 10);
          goToAddressHome();
        } else {
          triggerError("인증번호가 일치하지 않습니다.");
        }
      } catch (error) {
        triggerError("OTP 인증 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };
  // 에러 발생 시 애니메이션 초기화를 위한 함수
  const triggerError = (msg) => {
    setErrorMsg(msg);
    setIsError(true);
    setTimeout(() => setIsError(false), 500);
  };

  // 엔터키 이벤트 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleNextStep();
  };

  // 재등록 화면에서 인증 버튼 클릭 시 (가입 시와 동일한 verifyOtp 사용)
  const handleReRegistrationVerify = async () => {
    if (otp.length !== 6) return alert("6자리 인증번호를 입력해주세요.");

    setLoading(true);
    try {
      const response = await clientApi.updateSecretKey(
        email,
        otpData.secretKey,
        parseInt(otp)
      );

      if (response.success) {
        alert(
          "OTP 재등록이 완료되었습니다. 새로운 코드로 로그인을 진행합니다."
        );
        setOtp("");
        setStep(3);
      } else {
        alert("인증번호가 일치하지 않습니다. QR 코드를 다시 확인해주세요.");
      }
    } catch (error) {
      alert("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`root ${isDark ? "theme-dark" : "theme-light"}`}>
      <div className="theme-toggle">
        <span className="toggle-label">
          {isDark ? "다크 모드" : "라이트 모드"}
        </span>
        <label className="switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>

      <div className="login-card">
        {step !== 4 && (
          <div className="title-area">
            <h1 className="title-main">
              {step === 1 ? "로그인" : step === 2 ? "환영합니다" : "2단계 인증"}
            </h1>
            <div className="title-sub">
              {step === 1
                ? "계정 사용"
                : step === 2
                ? "비밀번호 입력"
                : "Google Authenticator 코드를 입력하세요"}
            </div>
          </div>
        )}

        {step >= 2 && step !== 4 && (
          <div
            className="email-chip"
            onClick={() => {
              setStep(1);
              setErrorMsg("");
              setIsError(false);
              setPassword("");
              setOtp("");
            }}
          >
            <span className="chip-icon">👤</span>
            <span className="chip-text">{email}</span>
            <span className="chip-arrow">▼</span>
          </div>
        )}

        <div className="input-area">
          {step === 1 && (
            <>
              <label className="field-label">이메일 또는 휴대전화</label>
              <input
                className={`field-input ${errorMsg ? "error-border" : ""} ${
                  isError ? "shake" : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </>
          )}

          {step === 2 && (
            <>
              <label className="field-label">비밀번호</label>
              <div className={`password-wrapper ${isError ? "shake" : ""}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`field-input password-input ${
                    errorMsg ? "error-border" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <label className="field-label">인증 코드</label>
              <input
                type="text"
                maxLength="6"
                className={`field-input ${errorMsg ? "error-border" : ""} ${
                  isError ? "shake" : ""
                }`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
                autoFocus
              />
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <span
                  className="link-btn-blue"
                  style={{
                    color: "#1a73e8",
                    cursor: "pointer",
                    fontSize: "14px",
                    textDecoration: "underline",
                  }}
                  onClick={handleResetOtp}
                >
                  OTP를 새로 등록하시겠습니까?
                </span>
              </div>
            </>
          )}
          {step === 4 && (
            <OtpSetup
              otpData={otpData}
              otpValue={otp}
              onOtpChange={setOtp}
              onVerify={handleReRegistrationVerify}
              onBack={() => setStep(3)}
              isRegistration={false}
            />
          )}

          {errorMsg && step !== 4 && (
            <div className="error-msg">{errorMsg}</div>
          )}
        </div>

        {step !== 4 && (
          <div className="actions-bottom">
            <button
              type="button"
              className="link-btn"
              onClick={step === 3 ? () => setStep(2) : goToSignUp}
            >
              {step === 3 ? "뒤로 가기" : "계정 만들기"}
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading
                ? "처리 중..."
                : step === 1
                ? "다음"
                : step === 2
                ? "로그인"
                : "인증"}
            </button>
          </div>
        )}
      </div>

      <footer className="footer">
        <select className="footer-select" defaultValue="ko">
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
        <div className="footer-links">
          <button className="footer-link">도움말</button>
          <button className="footer-link">개인정보처리방침</button>
          <button className="footer-link">약관</button>
        </div>
      </footer>
    </div>
  );
}
