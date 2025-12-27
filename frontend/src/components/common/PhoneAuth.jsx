// components/PhoneAuth.jsx
import React from "react";

export default function PhoneAuth({
  form,
  onChange,
  isOtpSent,
  handleSendOtp,
  handleVerifyOtp,
  timer,
  formatTime,
}) {
  return (
    <div className="auth-form">
      <div className="field-group animate-fade-in">
        <label className="field-label">전화번호</label>
        <div className="input-with-btn">
          <input
            name="phone"
            className="field-input"
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={onChange}
            disabled={isOtpSent}
          />
          <button className="secondary-btn" onClick={handleSendOtp}>
            {isOtpSent ? "재전송" : "전송"}
          </button>
        </div>
      </div>

      {isOtpSent && (
        <div className="field-group animate-fade-in">
          <label className="field-label">인증번호</label>
          <div className="input-with-btn">
            <div style={{ position: "relative", flex: 1 }}>
              <input
                name="otp"
                className="field-input"
                placeholder="6자리 입력"
                value={form.otp}
                onChange={onChange}
                style={{ width: "100%" }}
              />
              <span className="timer-text">{formatTime(timer)}</span>
            </div>
            <button className="primary-btn" onClick={handleVerifyOtp}>
              인증
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
