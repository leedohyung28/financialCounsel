import { useState } from "react";
import { clientApi } from "../api/clientApi";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../hooks/useNavigation";
import "../styles/LoginPage.css";
import "../styles/PasswordPage.css";
import "../styles/FindAccount.css";
import { setSession } from "../utils/session";

import OtpSetup from "./common/OtpSetup";
import StepEmail from "./login/StepEmail";
import StepOtpVerify from "./login/StepOtpVerify";
import StepPassword from "./login/StepPassword";
import FindAccount from "./login/FindAccount";

export default function LoginPage() {
  const { goToSignUp, goToAddressHome } = useNavigation();
  const { isDark, toggleTheme } = useTheme();

  // --- 공통 상태 ---
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  // --- 로그인 관련 상태 ---
  const [step, setStep] = useState(1); // 1:이메일, 2:비번, 3:OTP인증, 4:OTP등록
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpData, setOtpData] = useState({ secretKey: "", qrCodeUrl: "" });

  // --- 계정 찾기(FindMode) 관련 상태 ---
  const [findMode, setFindMode] = useState(false);
  const [findStep, setFindStep] = useState(1); // 1:이메일입력, 2:방식선택, 3:비번변경, 4:OTP인증(복구용)
  const [isHovered, setIsHovered] = useState(false);

  // --- 유틸리티 함수 ---
  const triggerError = (msg) => {
    setErrorMsg(msg);
    setIsError(true);
    setTimeout(() => setIsError(false), 500);
  };

  // --- 핸들러: 로그인 로직 ---
  const handleNextStep = async () => {
    if (step === 1) {
      if (!email.trim()) return alert("이메일을 입력해주세요.");
      setLoading(true);
      try {
        const { success, data } = await clientApi.validId(email);
        if (success && data.resultCode === 0) setStep(2);
        else triggerError(data?.message || "계정을 찾을 수 없습니다.");
      } catch {
        triggerError("오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (!password.trim()) return triggerError("비밀번호를 입력해주세요.");
      setLoading(true);
      try {
        const result = await clientApi.loginClient(email, password);
        if (result.success && result.data.resultCode === 0) {
          const otpCheck = await clientApi.validSecretKey(email);
          if (otpCheck.success) setStep(3);
          else {
            alert("OTP 등록 화면으로 이동합니다.");
            const setupRes = await clientApi.setupOtp(email);
            if (setupRes.success) {
              setOtpData(setupRes.data);
              setStep(4);
            }
          }
        } else triggerError("로그인 정보가 올바르지 않습니다.");
      } catch {
        triggerError("오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      if (otp.length !== 6) return triggerError("6자리 인증번호를 입력하세요.");
      setLoading(true);
      try {
        const response = await clientApi.verifyOtp(email, parseInt(otp));
        if (response.success) {
          setSession("userSession", email, 10);
          goToAddressHome();
        } else triggerError("인증번호가 일치하지 않습니다.");
      } catch {
        triggerError("오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- 핸들러: 계정 찾기 로직 ---
  const handleSendTempPw = async () => {
    if (!email) return alert("이메일을 입력해주세요.");
    setLoading(true);
    try {
      const result = await clientApi.sendPwdEmail(email);
      console.log(result);
      if (result.success) {
        alert(`${email}로 임시 비밀번호가 발송되었습니다.`);
        setFindMode(false);
        setFindStep(1);
      } else {
        alert("발송에 실패했습니다.");
      }
    } catch {
      alert("발송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpForReset = async () => {
    if (otp.length !== 6) return alert("6자리 코드를 입력하세요.");
    setLoading(true);
    try {
      const response = await clientApi.verifyOtp(email, parseInt(otp));
      if (response.success) {
        alert("인증 성공! 비밀번호를 변경해 주세요.");
        setFindStep(3); // 비밀번호 변경 단계
      } else alert("인증번호가 일치하지 않습니다.");
    } catch {
      alert("인증 처리 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleNextStep();
  };

  // --- 메인 렌더링 ---
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
        {findMode ? (
          <FindAccount
            findStep={findStep}
            setFindStep={setFindStep}
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={setOtp}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            setFindMode={setFindMode}
            handleSendTempPw={handleSendTempPw}
            handleOtpForReset={handleOtpForReset}
          />
        ) : (
          <>
            {/* 로그인 타이틀 영역 */}
            {step !== 4 && (
              <div className="title-area">
                <h1 className="title-main">
                  {step === 1
                    ? "로그인"
                    : step === 2
                    ? "환영합니다"
                    : "2단계 인증"}
                </h1>
                <div className="title-sub">
                  {step === 1
                    ? "계정 사용"
                    : step === 2
                    ? "비밀번호 입력"
                    : "Authenticator 코드 입력"}
                </div>
              </div>
            )}

            {/* 이메일 칩 표시 */}
            {step >= 2 && step !== 4 && (
              <div
                className="email-chip"
                onClick={() => {
                  setStep(1);
                  setPassword("");
                  setOtp("");
                }}
              >
                <span className="chip-icon">👤</span>
                <span className="chip-text">{email}</span>
                <span className="chip-arrow">▼</span>
              </div>
            )}

            {/* 로그인 입력 단계별 영역 */}
            <div className="input-area">
              {step === 1 && (
                <StepEmail
                  email={email}
                  setEmail={setEmail}
                  errorMsg={errorMsg}
                  isError={isError}
                  handleKeyDown={handleKeyDown}
                />
              )}
              {step === 2 && (
                <StepPassword
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  errorMsg={errorMsg}
                  isError={isError}
                  handleKeyDown={handleKeyDown}
                />
              )}
              {step === 3 && (
                <StepOtpVerify
                  otp={otp}
                  setOtp={setOtp}
                  onResetOtp={() => {}}
                  errorMsg={errorMsg}
                  isError={isError}
                  handleKeyDown={handleKeyDown}
                />
              )}
              {step === 4 && (
                <OtpSetup
                  otpData={otpData}
                  otpValue={otp}
                  onOtpChange={setOtp}
                  onVerify={() => {}}
                  onBack={() => setStep(3)}
                />
              )}
              {errorMsg && step !== 4 && (
                <div className="error-msg">{errorMsg}</div>
              )}
            </div>

            {/* 하단 버튼 영역 */}
            {step !== 4 && (
              <div className="actions-bottom">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <button
                    className="link-btn"
                    onClick={step === 3 ? () => setStep(2) : goToSignUp}
                  >
                    {step === 3 ? "뒤로 가기" : "계정 만들기"}
                  </button>
                  {step === 1 && (
                    <button
                      className="link-btn"
                      style={{
                        color: "#1a73e8",
                        padding: 0,
                        textAlign: "left",
                      }}
                      onClick={() => setFindMode(true)}
                    >
                      계정을 잊으셨습니까?
                    </button>
                  )}
                </div>
                <button
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
          </>
        )}
      </div>
    </div>
  );
}
