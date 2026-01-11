export default function StepOtpVerify({
  otp,
  setOtp,
  onResetOtp,
  errorMsg,
  isError,
  handleKeyDown,
}) {
  return (
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
        onKeyDown={handleKeyDown}
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
          onClick={onResetOtp}
        >
          OTP를 새로 등록하시겠습니까?
        </span>
      </div>
    </>
  );
}
