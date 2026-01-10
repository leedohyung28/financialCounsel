import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "../styles/SignUpPage.css";
import "../styles/SignUpComplete.css";
import "../styles/PhoneCertify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./common/PhoneAuth";
import PhoneAuth from "./common/PhoneAuth";
import {
  formatTime,
  handleSendOtp,
  handleVerifyOtp,
  onVerifyOtp,
} from "../context/PhoneAuth";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../hooks/useNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  checkFileSize,
  emailRegex,
  formatBirth,
  formatPhone,
  pwRegex,
  validateBirth,
} from "../context/FormatUtils";
import { clientApi } from "../api/clientApi";

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
    profileImage: null,
  });

  const [isIdVerified, setIsIdVerified] = useState(false); // 아이디 중복확인 여부
  const [pwErrorMsg, setPwErrorMsg] = useState("");
  const [isPwError, setIsPwError] = useState(false);
  const [isIdError, setIsIdError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 (180초)
  const [previewUrl, setPreviewUrl] = useState(null);

  // 타이머 기능
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const onChange = (e) => {
    const { name, value } = e.target;

    // 휴대폰 번호 자동 포매팅
    if (name === "phone") {
      setForm((prev) => ({ ...prev, [name]: formatPhone(value) }));
      return;
    }

    // 생년월일 자동 포매팅 (텍스트 입력 시)
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
    if (!emailRegex.test(form.userId)) {
      triggerIdError("유효한 이메일 형식이 아닙니다.");
      return;
    }
    try {
      const { success, data } = await clientApi.validEmail(form.userId);
      if (success && data.resultCode === 0) {
        alert("사용 가능한 아이디입니다.");
        setIsIdVerified(true);
      } else {
        triggerIdError("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      triggerIdError("중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 확인 검사 (커서가 옮겨졌을 때 - onBlur)
  const handlePwBlur = () => {
    if (form.passwordConfirm && form.password !== form.passwordConfirm) {
      triggerPwError("비밀번호가 일치하지 않습니다.");
    } else {
      setPwErrorMsg("");
      setIsPwError(false);
    }
  };

  const triggerPwError = (msg) => {
    setPwErrorMsg(msg);
    setIsPwError(true);
    setTimeout(() => setIsPwError(false), 500);
  };

  const triggerIdError = (msg) => {
    alert(msg);
    setIsIdError(true);
    setTimeout(() => setIsIdError(false), 500);
  };

  // [다음] 버튼 클릭 시 (1단계 -> 2단계)
  const handleNextStep = () => {
    if (!isIdVerified) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      triggerPwError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!emailRegex.test(form.userId)) {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    }
    if (!pwRegex.test(form.password)) {
      alert("비밀번호 규칙을 확인해주세요.");
      return;
    }

    // 생년월일 입력이 있는 경우 유효성 검사 추가
    if (form.birth && !validateBirth(form.birth)) {
      alert(
        "생년월일 형식이 올바르지 않거나 유효하지 않은 날짜입니다. (예: 1990-01-01)"
      );
      return;
    }

    setStep(2);
  };

  // [최종 가입 요청] 함수 추가
  const handleSignupSubmit = async () => {
    try {
      const formData = new FormData();

      // 서버(ClientVO)의 필드명에 맞춰서 formData 삽입
      formData.append("email", form.userId);
      formData.append("password", form.password);
      if (form.name) formData.append("name", form.name);
      formData.append("phoneNum", form.phone.replace(/[^0-9]/g, ""));
      if (form.birthday) formData.append("birthday", form.birthday);
      if (form.gender) formData.append("sex", form.gender);
      if (form.region) formData.append("location", form.region);
      if (form.profileImage) formData.append("image", form.profileImage);

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
                    disabled={isIdVerified}
                    className={`field-input flex-1 ${
                      isIdError ? "error-border shake" : ""
                    } ${isIdVerified ? "verified-input" : ""}`}
                    value={form.userId}
                    onChange={(e) => {
                      onChange(e);
                      setIsIdVerified(false);
                    }}
                    placeholder="example@domain.com"
                  />
                  <button
                    type="button"
                    disabled={isIdVerified}
                    className={`inner-check-btn ${
                      isIdVerified ? "verified-btn" : ""
                    }`}
                    onClick={handleCheckId}
                  >
                    {isIdVerified ? "확인됨" : "확인"}
                  </button>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">비밀번호</label>
                <div className="tooltip-container">
                  <input
                    name="password"
                    type="password"
                    className="field-input"
                    value={form.password}
                    onChange={onChange}
                  />
                  <span className="tooltip-text">
                    • 8자 이상 작성
                    <br />• 영문, 숫자, 특수문자 포함
                  </span>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">비밀번호 확인</label>
                <input
                  name="passwordConfirm"
                  type="password"
                  className={`field-input ${pwErrorMsg ? "error-border" : ""} ${
                    isPwError ? "shake" : ""
                  }`}
                  value={form.passwordConfirm}
                  onChange={onChange}
                  onBlur={handlePwBlur}
                />
                {pwErrorMsg && <div className="error-msg">{pwErrorMsg}</div>}
              </div>

              <div className="field-group">
                <label className="field-label">
                  이름 <span className="optional">(선택사항)</span>
                </label>
                <input
                  name="name"
                  className="field-input"
                  value={form.name}
                  onChange={onChange}
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
          /* 2) 전화번호 인증 폼 */
          <>
            <div className="title-area">
              <h1 className="title-main">본인 인증</h1>
              <div className="title-sub">
                전화번호를 통해 인증을 진행해주세요.
              </div>
            </div>
            <PhoneAuth
              form={form}
              onChange={onChange}
              isOtpSent={isOtpSent}
              handleSendOtp={() =>
                handleSendOtp(form.phone, setIsOtpSent, setTimer)
              }
              handleVerifyOtp={async () => {
                const success = await onVerifyOtp(form.otp, timer);
                if (success) {
                  handleSignupSubmit();
                  alert("인증에 성공하였습니다! 회원가입을 완료합니다.");
                } else {
                  alert("인증번호가 일치하지 않거나 시간이 만료되었습니다.");
                }
              }}
              timer={timer}
              formatTime={formatTime}
            />
            <div className="actions-bottom" style={{ marginTop: "40px" }}>
              <button className="link-btn" onClick={() => setStep(1)}>
                이전으로
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
