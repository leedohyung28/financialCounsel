import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function OtpSetup({
  otpData,
  otpValue,
  onOtpChange,
  onVerify,
  onBack,
  isRegistration = true, // 회원가입(true) 혹은 로그인/재등록(false) 구분용
}) {
  return (
    <>
      <div className="title-area">
        <h1 className="title-main">2차 인증 등록</h1>
        <div className="title-sub">
          Google Authenticator 앱으로 QR 코드를 스캔하세요.
        </div>
      </div>

      <div
        className="otp-auth-container"
        style={{ textAlign: "center", padding: "20px 0" }}
      >
        <div
          style={{
            background: "white",
            padding: "16px",
            display: "inline-block",
            borderRadius: "8px",
          }}
        >
          <QRCodeCanvas value={otpData.qrCodeUrl} size={200} />
        </div>

        <div
          className="field-group"
          style={{ marginTop: "24px", textAlign: "left" }}
        >
          <label className="field-label">인증 코드 입력</label>
          <div className="input-with-button">
            <input
              type="text"
              maxLength="6"
              className="field-input flex-1"
              placeholder="6자리 숫자 입력"
              value={otpValue}
              onChange={(e) =>
                onOtpChange(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <button className="primary-btn" onClick={onVerify}>
              {isRegistration ? "인증 및 완료" : "인증"}
            </button>
          </div>
          <p className="upload-info-text">
            스캔할 수 없는 경우 코드 직접 입력:{" "}
            <strong>{otpData.secretKey}</strong>
          </p>
        </div>
      </div>

      <div className="actions-bottom" style={{ marginTop: "20px" }}>
        <button className="link-btn" onClick={onBack}>
          이전으로
        </button>
      </div>
    </>
  );
}
