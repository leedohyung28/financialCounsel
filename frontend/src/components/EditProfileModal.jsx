import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { clientApi } from "../api/clientApi";
import {
  checkFileSize,
  formatBirth,
  formatPhone,
  pwRegex,
  validateBirth,
} from "../context/FormatUtils";
import { formatTime, handleSendOtp, onVerifyOtp } from "../context/PhoneAuth";
import "../styles/EditProfileModal.css";
import { getSession } from "../utils/session";
import PhoneAuth from "./common/PhoneAuth";

export default function EditProfileModal({ onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    name: "",
    birth: "",
    gender: "",
    region: "",
    password: "",
    passwordConfirm: "", // 비밀번호 확인 필드 추가
    phone: "",
    profileImage: null,
  });

  const [pwErrorMsg, setPwErrorMsg] = useState("");
  const [isPwError, setIsPwError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [timer, setTimer] = useState(180); // 3분 (180초)
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = getSession("userSession");
        if (!session) return;

        const userId = session.userId;
        const result = await clientApi.searchClient(userId);

        if (result.success && result.data) {
          const user = result.data;
          setForm((prev) => ({
            ...prev,
            userId: session.userId,
            name: user.name || "",
            birth: user.birth || "",
            gender: user.sex || "",
            region: user.location || "",
            phone: user.phoneNum ? formatPhone(user.phoneNum) : "",
          }));
          if (user.birth) setSelectedDate(new Date(user.birth));
          if (user.profilePath) setPreviewUrl(user.profilePath);
        }
      } catch (error) {
        console.error("데이터 로드 실패", error);
      }
    };
    fetchUserData();
  }, [onClose]);

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

  // 비밀번호 확인 로직 (onBlur)
  const handlePwBlur = () => {
    if (form.passwordConfirm && form.password !== form.passwordConfirm) {
      setPwErrorMsg("비밀번호가 일치하지 않습니다.");
      setIsPwError(true);
      setTimeout(() => setIsPwError(false), 500);
    } else {
      setPwErrorMsg("");
      setIsPwError(false);
    }
  };

  const handleSubmit = async () => {
    // 1. 비밀번호 입력 시 유효성 및 일치 확인
    if (form.password) {
      if (!pwRegex.test(form.password)) {
        alert(
          "비밀번호 규칙을 확인해주세요 (8자 이상, 영문/숫자/특수문자 포함).",
        );
        return;
      }
      if (form.password !== form.passwordConfirm) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return;
      }
    }

    // 2. 생년월일 유효성 검사
    if (form.birth && !validateBirth(form.birth)) {
      alert("생년월일 형식이 올바르지 않습니다. (예: 1990-01-01)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", form.userId);
      formData.append("name", form.name);
      if (form.password) formData.append("password", form.password);
      formData.append("phoneNum", form.phone.replace(/[^0-9]/g, ""));
      formData.append("sex", form.gender);
      formData.append("location", form.region);
      if (form.birth) formData.append("birthday", form.birth);
      if (form.profileImage) formData.append("image", form.profileImage);

      const response = await clientApi.updateClient(formData);
      if (response.success) {
        alert("정보가 수정되었습니다.");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      alert("수정 실패: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="title-main">정보 수정</h2>

        <div className="modal-scroll-area">
          <div className="profile-upload-container">
            <div className="profile-preview-wrapper">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="profile-preview"
                />
              ) : (
                <div className="profile-placeholder">👤</div>
              )}
              <label htmlFor="edit-profile-input" className="camera-icon-label">
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
          </div>

          <form className="grid-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field-group">
              <label className="field-label">새 비밀번호</label>
              <div className="tooltip-container">
                <input
                  name="password"
                  type="password"
                  className="field-input"
                  value={form.password}
                  onChange={onChange}
                  placeholder="변경 시에만 입력"
                  autoFocus
                />
                <span className="tooltip-text">
                  8자 이상, 영문/숫자/특수문자 포함
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
              <label className="field-label">이름</label>
              <input
                name="name"
                className="field-input"
                value={form.name}
                onChange={onChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label">생년월일</label>
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
              <label className="field-label">성별</label>
              <select
                name="gender"
                className="field-input select-input"
                value={form.gender}
                onChange={onChange}
              >
                <option value="">선택 안 함</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">거주지</label>
              <select
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

            <div className="field-group full-width">
              <label className="field-label">전화번호 인증</label>
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
                    setIsPhoneVerified(true);
                  }
                }}
                timer={timer}
                formatTime={formatTime}
              />
              {isPhoneVerified && (
                <p className="success-msg">인증이 완료되었습니다.</p>
              )}
            </div>
          </form>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            취소
          </button>
          <button className="primary-btn" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
