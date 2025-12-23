import React, { useState } from "react";
import "../styles/SignUpPage.css";

export default function SignupPage() {
  const [isDark, setIsDark] = useState(true);

  const [form, setForm] = useState({
    userId: "",
    name: "",
    birth: "",
    gender: "",
    region: "",
    password: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

      <div className="signup-card">
        <div className="title-area">
          <h1 className="title-main">회원가입</h1>
          <div className="title-sub">계정 만들기</div>
        </div>

        <form className="grid-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field-group">
            <label className="field-label" htmlFor="userId">
              아이디
            </label>
            <input
              id="userId"
              name="userId"
              className="field-input"
              value={form.userId}
              onChange={onChange}
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="field-input"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="name">
              이름 <span className="optional">(선택사항)</span>
            </label>
            <input
              id="name"
              name="name"
              className="field-input"
              value={form.name}
              onChange={onChange}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="birth">
              생년월일 <span className="optional">(선택사항)</span>
            </label>
            <input
              id="birth"
              name="birth"
              className="field-input"
              placeholder="YYYY-MM-DD"
              value={form.birth}
              onChange={onChange}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="gender">
              성별 <span className="optional">(선택사항)</span>
            </label>
            <select
              id="gender"
              name="gender"
              className="field-input select-input"
              value={form.gender}
              onChange={onChange}
            >
              <option value="">선택 안 함</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
              <option value="no">표시 안 함</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="region">
              거주지 <span className="optional">(선택사항)</span>
            </label>
            <select
              id="region"
              name="region"
              className="field-input select-input"
              value={form.region}
              onChange={onChange}
            >
              <option value="">선택 안 함</option>
              <option value="kr">대한민국</option>
              <option value="us">미국</option>
              <option value="jp">일본</option>
              <option value="etc">기타</option>
            </select>
          </div>
        </form>

        <div className="actions-bottom">
          <button type="button" className="link-btn">
            대신 로그인하기
          </button>
          <button type="button" className="primary-btn">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
