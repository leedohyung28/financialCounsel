import React, { useState } from "react";
import "../styles/EditProfileModal.css";
import { getSession } from "../utils/session";
import { clientApi } from "../api/clientApi";

export default function PasswordVerifyModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");

  const handleVerify = async () => {
    const session = getSession("userSession");
    if (!session || !session.userId) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      const userId = session.userId;

      // 서버의 비밀번호 확인
      const result = await clientApi.loginClient(userId, password);
      console.log(result);
      if (result.success && result.data.resultCode === 0) {
        onSuccess();
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      // 3. 서버가 400, 401 에러 등을 던졌을 때 catch에서 처리
      console.error("인증 에러 상세:", error);

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        alert(serverMessage); // 서버에서 보낸 에러 메시지 노출
      } else {
        alert("비밀번호가 일치하지 않거나 인증에 실패했습니다.");
      }
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
            autoFocus
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
