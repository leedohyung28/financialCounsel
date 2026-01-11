import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function StepPassword({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errorMsg,
  isError,
  handleKeyDown,
}) {
  return (
    <>
      <label className="field-label">비밀번호</label>
      <div className={`password-wrapper ${isError ? "shake" : ""}`}>
        <input
          type={showPassword ? "text" : "password"}
          className={`field-input password-input ${
            errorMsg ? "error-border" : ""
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
    </>
  );
}
