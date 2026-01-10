import React, { useState } from "react";
import "../styles/EditProfileModal.css";
import { getSession } from "../utils/session";
import { clientApi } from "../api/clientApi";

export default function PasswordVerifyModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");

  const handleVerify = async () => {
    try {
      const userId = getSession("userSession").userId;

      // 서버의 비밀번호 확인
      const result = await clientApi.loginClient(userId, password);

      if (result.success) {
        onSuccess(); // 확인 성공 시 다음 단계로
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("인증 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="edit-modal-card verify-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="title-main">비밀번호 확인</h2>
        <p className="title-sub">
          개인정보 보호를 위해 비밀번호를 다시 입력해주세요.
        </p>

        <div className="field-group" style={{ marginTop: "20px" }}>
          <input
            type="password"
            className="field-input"
            placeholder="현재 비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          />
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            취소
          </button>
          <button className="primary-btn" onClick={handleVerify}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
