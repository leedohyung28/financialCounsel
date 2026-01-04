import React, { useState } from "react";
import "../styles/LoginPage.css";
import "../styles/PasswordPage.css";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../hooks/useNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../utils/axios";

export default function LoginPage() {
  const { goToFindAccount, goToSignUp, goToAddressHome } = useNavigation();
  const { isDark, toggleTheme } = useTheme();

  // 로그인 단계 관리 (1: 이메일, 2: 비밀번호)
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isError, setIsError] = useState(false);

  // '다음' 또는 '로그인' 버튼 클릭 핸들러
  const handleNextStep = async () => {
    if (step === 1) {
      if (email.trim().length === 0) {
        alert("이메일을 입력해주세요.");
        return;
      }

      setLoading(true);
      setEmailError("");
      setIsError(false);
      try {
        const response = await api.post("/api/client/search/email", {
          email: email,
        });

        // Output(계정 존재 여부) 확인
        const resultCode = response.data.resultCode;
        const message = response.data.message;

        if (resultCode === 0) {
          // 계정이 존재하면 다음 단계로
          setStep(2);
        } else {
          // 계정이 존재하지 않으면 에러 처리
          triggerError(message);
        }
      } catch (error) {
        triggerError("이메일 확인 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else {
      // --- STEP 2: 암호화 및 로그인 로직 ---
      if (password.trim().length === 0) {
        triggerError("비밀번호를 입력해주세요.");
        return;
      }

      setLoading(true);
      try {
        // 로그인 API 호출
        const response = await api.post("/api/client/login", {
          email: email,
          password: password,
        });

        // Output(로그인) 확인
        const resultCode = response.data.resultCode;
        const message = response.data.message;

        // 결과 확인
        if (resultCode === 0) {
          goToAddressHome();
        } else {
          triggerError(message);
        }
      } catch (error) {
        console.error("로그인 오류:", error);
        triggerError("로그인 처리 중 서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };
  // 에러 발생 시 애니메이션 초기화를 위한 함수
  const triggerError = (msg) => {
    setEmailError(msg);
    setIsError(true);
    // 0.5초(애니메이션 시간) 후 클래스 제거 (재반복 가능하도록)
    setTimeout(() => setIsError(false), 500);
  };

  // 입력 시 에러 메시지 초기화
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  // 이메일 수정하고 싶을 때 되돌아가기
  const handleBackToEmail = () => {
    setStep(1);
    setPassword("");
    setEmailError("");
    setIsError(false);
  };

  // 엔터키 이벤트 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNextStep();
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
        <div className="title-area">
          <h1 className="title-main">{step === 1 ? "로그인" : "환영합니다"}</h1>
          <div className="title-sub">
            {step === 1 ? "계정 사용" : "비밀번호를 입력하세요"}
          </div>
        </div>

        {/* 2단계일 때, 입력한 이메일을 보여주는 칩 (구글 스타일) */}
        {step === 2 && (
          <div className="email-chip" onClick={handleBackToEmail}>
            <span className="chip-icon">👤</span>
            <span className="chip-text">{email}</span>
            <span className="chip-arrow">▼</span>
          </div>
        )}

        <div className="input-area">
          {step === 1 ? (
            /* STEP 1: 이메일 입력 */
            <>
              <label className="field-label" htmlFor="email">
                이메일 또는 휴대전화
              </label>
              <input
                id="email"
                className={`field-input ${emailError ? "error-border" : ""} ${
                  isError ? "shake" : ""
                }`}
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {emailError && <div className="error-msg">{emailError}</div>}
              {!emailError}
              <button
                type="button"
                className="link-btn"
                onClick={goToFindAccount}
              >
                이메일을 잊으셨나요?
              </button>
            </>
          ) : (
            /* STEP 2: 비밀번호 입력 */
            <>
              <label className="field-label" htmlFor="password">
                비밀번호
              </label>
              <div className={`password-wrapper ${isError ? "shake" : ""}`}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`field-input password-input ${
                    emailError ? "error-border" : ""
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (emailError) {
                      setEmailError("");
                      setIsError(false);
                    }
                  }}
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
              {emailError && <div className="error-msg">{emailError}</div>}
            </>
          )}
        </div>

        <div className="actions-bottom">
          {step === 1 ? (
            <button type="button" className="link-btn" onClick={goToSignUp}>
              계정 만들기
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            className="primary-btn"
            onClick={handleNextStep}
            disabled={loading}
          >
            {loading ? "처리 중..." : step === 1 ? "다음" : "로그인"}
          </button>
        </div>
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
