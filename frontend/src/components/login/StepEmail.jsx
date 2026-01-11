export default function StepEmail({
  email,
  setEmail,
  onNext,
  errorMsg,
  isError,
  handleKeyDown,
}) {
  return (
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
  );
}
