import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../utils/axios";
import {
  pwRegex,
  formatPhone,
  formatBirth,
  checkFileSize,
  validateBirth,
} from "../context/FormatUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/EditProfileModal.css"; // 전용 스타일 추가
import { clientApi } from "../api/clientApi";
import { getSession } from "../utils/session";

export default function EditProfileModal({ onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm] = useState({
    userId: "", // 아이디는 표시용 (수정 불가)
    name: "",
    birth: "",
    gender: "",
    region: "",
    password: "",
    phone: "",
    profileImage: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // 초기 데이터 로딩 (내 정보 조회)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getSession("userSession").userId;

        const user = await clientApi.searchClient(userId);

        setForm({
          ...form,
          userId: userId,
          name: user.name || "",
          birth: user.birth || "",
          gender: user.sex || "",
          region: user.location || "",
          phone: formatPhone(user.phoneNum) || "",
        });
        if (user.profilePath) setPreviewUrl(user.profilePath);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      }
    };
    fetchUserData();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // 비밀번호 입력시에만 정규식 체크
    if (form.password && !pwRegex.test(form.password)) {
      alert("비밀번호 규칙을 확인해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.password) formData.append("password", form.password);
      formData.append("phoneNum", form.phone.replace(/[^0-9]/g, ""));
      formData.append("sex", form.gender);
      formData.append("location", form.region);
      if (form.profileImage) formData.append("image", form.profileImage);

      const response = await api.put("/api/client/update", formData);
      if (response.data.success) {
        alert("정보가 수정되었습니다.");
        onClose();
        window.location.reload(); // 변경사항 반영을 위해 리로드
      }
    } catch (error) {
      alert("수정 실패: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  return (
    // 모달 외부 배경 (클릭 시 닫힘)
    <div className="modal-overlay" onClick={onClose}>
      {/* 모달 본체 (내부 클릭 시 닫힘 방지) */}
      <div className="edit-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="title-main">정보 수정</h2>
        <p className="title-sub">{form.userId}</p>

        <div className="modal-scroll-area">
          {/* 프로필 이미지 수정 영역 */}
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
              <label htmlFor="edit-profile-input" className="camera-icon-label">
                <FontAwesomeIcon icon={faCamera} />
              </label>
            </div>
            <input
              id="edit-profile-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && checkFileSize(file, 10)) {
                  setForm((p) => ({ ...p, profileImage: file }));
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <form className="grid-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field-group">
              <label className="field-label">새 비밀번호 (변경 시에만)</label>
              <input
                name="password"
                type="password"
                className="field-input"
                value={form.password}
                onChange={onChange}
              />
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
            {/* 추가 필드(성별, 생일 등)는 SignUpPage와 동일하게 배치 */}
          </form>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            취소
          </button>
          <button className="primary-btn" onClick={handleSubmit}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
