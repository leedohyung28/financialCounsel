import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "../styles/SignUpPage.css";
import "../styles/SignUpComplete.css";
import "../styles/PhoneCertify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./common/PhoneAuth";
import PhoneAuth from "./common/PhoneAuth";
import { formatTime, handleVerifyOtp } from "../context/PhoneAuth";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../hooks/useNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import api from "../utils/axios";

export default function SignupPage() {
  const { isDark, toggleTheme } = useTheme();
  const { goToLogin } = useNavigation();
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 전화번호인증

  const [form, setForm] = useState({
    userId: "",
    name: "",
    birth: "",
    gender: "",
    region: "",
    password: "",
    phone: "",
    otp: "",
    profileImage: null,
  });

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setForm((prev) => ({
      ...prev,
      birth: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. 파일 객체를 form에 저장
      setForm((prev) => ({ ...prev, profileImage: file }));

      // 2. 브라우저 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // [다음] 버튼 클릭 시 (1단계 -> 2단계)
  const handleNextStep = () => {
    if (!emailRegex.test(form.userId)) {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    }
    if (!pwRegex.test(form.password)) {
      alert("비밀번호 규칙을 확인해주세요.");
      return;
    }
    setStep(2);
  };

  // [전송 / 재전송] 버튼
  const handleSendOtp = () => {
    if (!form.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    setIsOtpSent(true);
    setTimer(180);
    alert("인증번호가 발송되었습니다.");
  };

  // [최종 가입 요청] 함수 추가
  const handleSignupSubmit = async () => {
    try {
      // 파일 전송을 위해 FormData 객체 생성
      const formData = new FormData();

      // 일반 폼 필드 추가
      Object.keys(form).forEach((key) => {
        if (key !== "profileImage") {
          formData.append(key, form[key]);
        }
      });

      // 프로필 이미지 파일이 있다면 추가
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      // API 호출 (multipart/form-data)
      const response = await api.post("/api/client/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.data.resultCode === 0) {
        setIsCompleted(true); // 가입 완료 화면으로 전환
      } else {
        alert(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  // [인증 확인 핸들러] 수정
  const onVerifyOtp = async () => {
    // 1. 먼저 OTP 번호가 입력되었는지 확인
    if (!form.otp) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    // 인증 시도 (기존 handleVerifyOtp 로직 활용)
    const isSuccess = await handleVerifyOtp(timer, form.otp, () => {});

    if (isSuccess) {
      alert("인증에 성공하였습니다! 회원가입을 완료합니다.");
      handleSignupSubmit(); // 인증 성공 시 바로 가입 요청
    } else {
      alert("인증번호가 일치하지 않거나 시간이 만료되었습니다.");
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
              <div className="field-group">
                <label className="field-label">아이디</label>
                <input
                  name="userId"
                  className="field-input"
                  value={form.userId}
                  onChange={onChange}
                  placeholder="example@domain.com"
                />
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
                  selected={selectedDate}
                  onChange={handleDateChange}
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
              handleSendOtp={handleSendOtp}
              handleVerifyOtp={onVerifyOtp}
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
