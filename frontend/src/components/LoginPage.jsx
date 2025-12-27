// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import "../styles/PasswordPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const moveToSignUp = () => {
    navigate("../SignUpPage");
  };
  const moveToFindAccount = () => {
    navigate("../FindAccountPage");
  };

  const [isDark, setIsDark] = useState(true);

  // 로그인 단계 관리 (1: 이메일, 2: 비밀번호)
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // '다음' 또는 '로그인' 버튼 클릭 핸들러
  const handleNextStep = () => {
    if (step === 1) {
      // 간단한 이메일 유효성 검사 (빈 값 체크)
      if (email.trim().length > 0) {
        setStep(2); // 비밀번호 입력 단계로 이동
      } else {
        alert("이메일을 입력해주세요.");
      }
    } else {
      // 여기서 실제 로그인 API 호출
      console.log("로그인 시도:", { email, password });
      alert(`로그인 시도\nID: ${email}\nPW: ${password}`);
    }
  };

  // 이메일 수정하고 싶을 때 되돌아가기
  const handleBackToEmail = () => {
    setStep(1);
    setPassword(""); // 비밀번호 초기화 (선택사항)
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
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark((v) => !v)}
          />
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
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button
                type="button"
                className="link-btn"
                onClick={moveToFindAccount}
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
              <input
                id="password"
                type="password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <div className="show-pw-toggle">
                <input
                  type="checkbox"
                  id="showPw"
                  onClick={() => {
                    const input = document.getElementById("password");
                    input.type =
                      input.type === "password" ? "text" : "password";
                  }}
                />
                <label htmlFor="showPw">비밀번호 표시</label>
              </div>
            </>
          )}
        </div>

        <div className="actions-bottom">
          {step === 1 ? (
            <button type="button" className="link-btn" onClick={moveToSignUp}>
              계정 만들기
            </button>
          ) : (
            /* 2단계에서는 계정 만들기 대신 '뒤로 가기' 혹은 공백 처리 */
            <button
              type="button"
              className="link-btn"
              style={{ visibility: "hidden" }}
            >
              placeholder
            </button>
          )}

          <button
            type="button"
            className="primary-btn"
            onClick={handleNextStep}
          >
            {step === 1 ? "다음" : "로그인"}
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
