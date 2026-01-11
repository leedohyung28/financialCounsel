import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { clientApi } from "../api/clientApi";
import {
  checkFileSize,
  emailRegex,
  formatBirth,
  formatPhone,
  pwRegex,
} from "../context/FormatUtils";
import { handleRandomName } from "../context/RandomGenerator";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../hooks/useNavigation";
import "../styles/PhoneCertify.css";
import "../styles/SignUpComplete.css";
import "../styles/SignUpPage.css";
import "./common/PhoneAuth";
import OtpSetup from "./common/OtpSetup";

export default function SignupPage() {
  const { isDark, toggleTheme } = useTheme();
  const { goToLogin } = useNavigation();
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 전화번호인증

  const [form, setForm] = useState({
    userId: "",
    name: "",
    birthday: "",
    gender: "",
    region: "",
    password: "",
    phone: "",
    otp: "",
    secretKey: "",
    profileImage: null,
  });

  const [isIdVerified, setIsIdVerified] = useState(false); // 아이디 중복확인 여부
  const [idErrorMsg, setIdErrorMsg] = useState("");
  const [pwErrorMsg, setPwErrorMsg] = useState("");
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [isPwError, setIsPwError] = useState(false);
  const [isIdError, setIsIdError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isNameError, setIsNameError] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [otpData, setOtpData] = useState({ secretKey: "", qrCodeUrl: "" }); // OTP 정보 저장

  const isPwValid = pwRegex.test(form.password);

  useEffect(() => {
    if (passwordConfirm === "") {
      setPwErrorMsg("");
    } else if (form.password !== passwordConfirm) {
      setPwErrorMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setPwErrorMsg("비밀번호가 일치합니다."); // 혹은 빈 값("")
    }
  }, [form.password, passwordConfirm]);

  const onChange = (e) => {
    const { name, value } = e.target;

    // 1. 비밀번호 확인 필드 처리
    if (name === "passwordConfirm") {
      setPasswordConfirm(value);
      return;
    }

    // 2. 휴대폰 번호 자동 포매팅
    if (name === "phone") {
      setForm((prev) => ({ ...prev, [name]: formatPhone(value) }));
      return;
    }

    // 3. 생년월일 처리
    if (name === "birthText") {
      const formatted = formatBirth(value);
      setForm((prev) => ({ ...prev, birth: formatted }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 외부 함수 호출 (파일 객체와 제한 용량 전달)
    if (!checkFileSize(file, 10)) {
      e.target.value = ""; // 검증 실패 시 input 초기화
      return;
    }

    // 파일 객체를 form에 저장
    setForm((prev) => ({ ...prev, profileImage: file }));

    // 브라우저 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 아이디 중복 확인
  const handleCheckId = async () => {
    setIdErrorMsg("");
    if (!emailRegex.test(form.userId)) {
      triggerIdError("유효한 이메일 형식이 아닙니다.");
      return;
    }
    try {
      const { success, data } = await clientApi.validEmail(form.userId);
      if (success && data.resultCode === 0) {
        setIdErrorMsg("사용 가능한 아이디입니다.");
        setIsIdVerified(true);
      } else {
        triggerIdError("이미 사용 중인 아이디입니다.");
        setIsIdVerified(false);
      }
    } catch (error) {
      triggerIdError("중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 확인 검사 (커서가 옮겨졌을 때 - onBlur)
  const handlePwBlur = () => {
    if (passwordConfirm && form.password !== passwordConfirm) {
      triggerPwError("비밀번호가 일치하지 않습니다.");
    } else {
      setPwErrorMsg("");
    }
  };

  const handleOtpInputChange = (value) => {
    setForm((prev) => ({ ...prev, otp: value }));
  };

  const triggerIdError = (msg) => {
    setIdErrorMsg(msg);
    setIsIdError(true);
    setTimeout(() => setIsIdError(false), 500);
  };

  const triggerPwError = (msg) => {
    setPwErrorMsg(msg);
    setIsPwError(true);
    setTimeout(() => setIsPwError(false), 500);
  };

  // [다음] 버튼 클릭 시 (1단계 -> 2단계)
  const handleNextStep = async () => {
    if (!isIdVerified) {
      triggerIdError("아이디 중복 확인을 해주세요.");
      return;
    }
    if (!isPwValid) {
      triggerPwError("비밀번호 규칙을 먼저 확인해주세요.");
      return;
    }
    if (form.password !== passwordConfirm) {
      triggerPwError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.name || form.name.trim() === "") {
      setNameErrorMsg("이름은 필수 입력 항목입니다.");
      return;
    }

    try {
      const response = await clientApi.setupOtp(form.userId);
      if (response.success) {
        setOtpData({
          secretKey: response.data.secretKey,
          qrCodeUrl: response.data.qrCodeUrl,
        });
        setForm((prev) => ({ ...prev, secretKey: response.data.secretKey }));
        setStep(2);
      }
    } catch (error) {
      setIdErrorMsg("OTP 설정 중 오류가 발생했습니다.");
    }
  };

  // [최종 가입 요청] 함수 추가
  const handleSignupSubmit = async () => {
    try {
      const formData = new FormData();

      // 서버(ClientVO)의 필드명에 맞춰서 formData 삽입
      formData.append("email", form.userId);
      formData.append("password", form.password);
      if (form.name) formData.append("name", form.name);
      if (form.phone)
        formData.append("phoneNum", form.phone.replace(/[^0-9]/g, ""));
      if (form.birthday) formData.append("birthday", form.birthday);
      if (form.gender) formData.append("sex", form.gender);
      if (form.region) formData.append("location", form.region);
      if (form.profileImage) formData.append("image", form.profileImage);
      formData.append("secretOtpKey", form.secretKey);

      // API 호출
      const { success, message } = await clientApi.signUpClient(formData);

      if (success) {
        setIsCompleted(true);
      } else {
        // 비즈니스 로직 상의 에러
        alert(message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleOtpVerify = async () => {
    if (form.otp.length !== 6) {
      alert("6자리 숫자를 정확히 입력해주세요.");
      return;
    }

    try {
      // 이전에 만든 /api/2fa/verify 엔드포인트 활용
      const response = await clientApi.verifyInitOtp(
        form.userId,
        parseInt(form.otp)
      );

      if (response.success) {
        alert("OTP 인증에 성공하였습니다! 회원가입을 완료합니다.");
        handleSignupSubmit(); // 최종 회원가입 처리
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("인증 처리 중 오류가 발생했습니다.");
      setStep(1);
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

      <div
        className={`signup-card ${isCompleted ? "completed" : `step-${step}`}`}
      >
        {isCompleted ? (
          <div className="signup-complete-content">
            <h1 className="complete-title">회원가입이 완료되었습니다</h1>
            <p className="complete-message">
              로그인 화면으로 돌아가 로그인을 진행해주세요.
            </p>
            <div className="actions-bottom">
              <div></div>
              <button className="complete-login-btn" onClick={goToLogin}>
                로그인
              </button>
            </div>
          </div>
        ) : step === 1 ? (
          /* 1) 기존 회원가입 폼 */
          <>
            <div className="title-area">
              <h1 className="title-main">회원가입</h1>
              <div className="title-sub">계정 만들기</div>
            </div>

            <div className="profile-upload-container">
              <div className="profile-preview-wrapper">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="profile-preview"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <span className="user-icon">👤</span>
                  </div>
                )}
                <label htmlFor="profile-input" className="camera-icon-label">
                  <FontAwesomeIcon icon={faCamera} />
                </label>
              </div>
              <input
                id="profile-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <p className="upload-info-text">
                프로필 사진을 등록해주세요 (선택)
              </p>
            </div>

            <form className="grid-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-group full-width">
                <label className="field-label">아이디</label>
                <div className="input-with-button">
                  <input
                    name="userId"
                    className={`field-input flex-1 ${
                      isIdError ? "error-border shake" : ""
                    } ${isIdVerified ? "verified-input" : ""}`}
                    value={form.userId}
                    onChange={(e) => {
                      onChange(e);
                      setIsIdVerified(false);
                      setIdErrorMsg("");
                    }}
                    placeholder="example@domain.com"
                  />
                  <button
                    type="button"
                    onClick={handleCheckId}
                    className="inner-check-btn"
                  >
                    {isIdVerified ? "확인됨" : "확인"}
                  </button>
                </div>
                {idErrorMsg && (
                  <div
                    className={`message-text ${
                      isIdVerified ? "success-blue" : "error-red"
                    }`}
                  >
                    {idErrorMsg}
                  </div>
                )}
              </div>
              <div className="field-group">
                <label className="field-label">비밀번호</label>
                <input
                  name="password"
                  type="password"
                  className="field-input"
                  value={form.password}
                  onChange={(e) => {
                    onChange(e);
                    setPwErrorMsg("");
                  }}
                />
              </div>
              <div className="field-group">
                <label className="field-label">비밀번호 확인</label>
                <input
                  name="passwordConfirm" // 이 이름이 onChange의 e.target.name과 일치해야 함
                  type="password"
                  disabled={!isPwValid}
                  className={`field-input ${
                    !isPwValid ? "input-disabled" : ""
                  } ${isPwError ? "error-border shake" : ""}`}
                  placeholder={!isPwValid ? "비밀번호를 먼저 입력하세요" : ""}
                  value={passwordConfirm}
                  onChange={onChange} // 위에서 수정한 onChange 호출
                />
                {pwErrorMsg && (
                  <div
                    className={`message-text ${
                      form.password === passwordConfirm
                        ? "success-blue"
                        : "error-red"
                    }`}
                  >
                    {pwErrorMsg}
                  </div>
                )}
              </div>
              <div className="field-group full-width">
                <label className="field-label">이름</label>
                <div className="input-with-button">
                  <input
                    name="name"
                    className={`field-input flex-1 ${
                      isNameError ? "error-border shake" : ""
                    }`}
                    value={form.name}
                    onChange={(e) => {
                      onChange(e);
                      setNameErrorMsg("");
                    }}
                  />
                  <button
                    type="button"
                    className="inner-check-btn"
                    onClick={() => handleRandomName(setForm, setIsNameError)}
                  >
                    랜덤 생성
                  </button>
                </div>
                {nameErrorMsg && (
                  <div className="message-text error-red">{nameErrorMsg}</div>
                )}
              </div>

              <div className="field-group full-width">
                <label className="field-label">
                  휴대폰 번호<span className="optional">(선택사항)</span>
                </label>
                <input
                  name="phone"
                  type="text"
                  className="field-input"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={onChange} // 기존 자동 포매팅 로직 활용
                  maxLength="13"
                />
              </div>
              <div className="field-group">
                <label className="field-label">
                  생년월일 <span className="optional">(선택사항)</span>
                </label>
                <DatePicker
                  name="birthText"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  onChange={onchange}
                  dateFormat="yyyy-MM-dd"
                  className="field-input"
                  placeholderText="YYYY-MM-DD"
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

                  <option value="none">표시 안 함</option>
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
              <button className="link-btn" onClick={goToLogin}>
                로그인하기
              </button>
              <button className="primary-btn" onClick={handleNextStep}>
                다음
              </button>
            </div>
          </>
        ) : (
          <OtpSetup
            otpData={otpData}
            otpValue={form.otp}
            onOtpChange={handleOtpInputChange}
            onVerify={handleOtpVerify}
            onBack={() => setStep(1)}
            isRegistration={true}
          />
        )}
      </div>
    </div>
  );
}
