import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const moveToSignUp = () => {
    navigate("./SignUpPage");
  };

  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState("");

  return (
    <div className={`root ${isDark ? "theme-dark" : "theme-light"}`}>
      <div className="theme-toggle">
        <label>
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark((v) => !v)}
          />
          다크 모드
        </label>
      </div>

      <div className="login-card">
        <div className="title-area">
          <h1 className="title-main">로그인</h1>
          <div className="title-sub">계정 사용</div>
        </div>

        <div className="input-area">
          <label className="field-label" htmlFor="email">
            이메일 또는 휴대전화
          </label>
          <input
            id="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" className="link-btn">
            이메일을 잊으셨나요?
          </button>
        </div>

        <div className="actions-bottom">
          <button type="button" className="link-btn" onClick={moveToSignUp}>
            계정 만들기
          </button>
          <button type="button" className="primary-btn">
            다음
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
