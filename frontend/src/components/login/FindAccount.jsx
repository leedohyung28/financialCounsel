import React from "react";

export default function FindAccount({
  findStep,
  setFindStep,
  email,
  setEmail,
  otp,
  setOtp,
  isHovered,
  setIsHovered,
  setFindMode,
  handleSendTempPw,
  handleOtpForReset,
  loading,
}) {
  return (
    <div className="find-account-area">
      <h1 className="title-main">계정 찾기</h1>

      {/* 1단계: 이메일 입력 */}
      {findStep === 1 && (
        <div className="input-group">
          <p className="title-sub">비밀번호를 재설정할 이메일을 입력하세요.</p>
          <div
            className="tooltip-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <input
              className="field-input"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isHovered && (
              <div className="custom-tooltip">
                아이디를 잊으셨으면 관리자에게 문의해주십시오.
              </div>
            )}
          </div>
          <div className="actions-bottom" style={{ marginTop: "20px" }}>
            <button className="link-btn" onClick={() => setFindMode(false)}>
              취소
            </button>
            <button className="primary-btn" onClick={() => setFindStep(2)}>
              다음
            </button>
          </div>
        </div>
      )}

      {/* 2단계: 복구 방식 선택 */}
      {findStep === 2 && (
        <div className="recovery-options">
          <p className="title-sub">복구 방식을 선택하세요.</p>
          <div
            className={`option-card ${loading ? "disabled" : ""}`}
            onClick={!loading ? handleSendTempPw : null}
            style={{
              pointerEvents: loading ? "none" : "auto",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <div className="option-icon">
              {loading ? (
                <div
                  className="spinner"
                  style={{ borderTopColor: "#1a73e8" }}
                />
              ) : (
                "📧"
              )}
            </div>
            <div className="option-text">
              <strong>{loading ? "발송 중..." : "임시 비밀번호 발송"}</strong>
              <span>이메일로 임시 비밀번호를 보냅니다.</span>
            </div>
          </div>
          <div
            className="option-card"
            onClick={() => {
              if (loading) return;
              setOtp("");
              setFindStep(4);
            }}
          >
            <div className="option-icon">📱</div>
            <div className="option-text">
              <strong>OTP 인증</strong>
              <span>인증 후 비밀번호를 즉시 변경합니다.</span>
            </div>
          </div>
          <button
            className="link-btn full-width"
            onClick={() => setFindStep(1)}
            disabled={loading}
          >
            뒤로 가기
          </button>
        </div>
      )}

      {/* 4단계: OTP 입력 (인증용) */}
      {findStep === 4 && (
        <div className="otp-reset-area">
          <p className="title-sub">Authenticator 앱의 코드를 입력하세요.</p>
          <input
            className="field-input"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="000000"
          />
          <div className="actions-bottom" style={{ marginTop: "20px" }}>
            <button className="link-btn" onClick={() => setFindStep(2)}>
              이전
            </button>
            <button
              className="primary-btn"
              onClick={handleOtpForReset}
              disabled={loading}
            >
              {loading ? (
                <div className="btn-content">
                  <div className="spinner" />
                  <span>처리 중</span>
                </div>
              ) : (
                "인증하기"
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3단계: 새 비밀번호 설정 */}
      {findStep === 3 && (
        <div className="new-pw-area">
          <p className="title-sub">새로운 비밀번호를 입력하세요.</p>
          <input
            type="password"
            placeholder="새 비밀번호"
            className="field-input"
            style={{ marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="field-input"
          />
          <button
            className="primary-btn full-width"
            style={{ marginTop: "20px" }}
            onClick={() => {
              alert("변경 완료");
              setFindMode(false);
              setFindStep(1);
            }}
          >
            비밀번호 변경 완료
          </button>
        </div>
      )}
    </div>
  );
}
