import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "../../hooks/useNavigation";
import { extendSession, logout } from "../../utils/session";
import "../../styles/Header.css";

export default function Header() {
  const [timeLeft, setTimeLeft] = useState("03:00");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { goToLogin } = useNavigation();

  const [sessionTick, setSessionTick] = useState(0);

  const formatTime = (expiry) => {
    const now = new Date().getTime();
    const diff = expiry - now;
    if (diff <= 0) return "00:00";
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    // 즉시 현재 세션 시간을 반영 (버튼 클릭 시점을 위해)
    const updateDisplay = () => {
      const sessionStr = sessionStorage.getItem("userSession");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const formatted = formatTime(session.expiry);
        setTimeLeft(formatted);
        if (new Date().getTime() > session.expiry) handleLogout();
      } else {
        goToLogin();
      }
    };

    updateDisplay(); // Effect 실행 시 즉시 한 번 호출

    const timer = setInterval(updateDisplay, 1000);

    return () => clearInterval(timer);
    // sessionTick이 바뀔 때마다 타이머를 재설정하여 싱크를 맞춤
  }, [goToLogin, sessionTick]);

  const handleExtend = () => {
    extendSession(3.01);
    setSessionTick((prev) => prev + 1);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    goToLogin();
  };

  return (
    <header className="common-header">
      <div className="header-right">
        <div className="session-container">
          <span className="timer-display">{timeLeft}</span>
          <div
            className="dropdown-wrapper"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <span className="arrow-icon">▼</span>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <button type="button" onClick={handleExtend}>
                  세션 시간 연장
                </button>
                <button type="button" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="theme-toggle-header">
          <span className="toggle-label-header">
            {isDark ? "다크 모드" : "라이트 모드"}
          </span>
          <label className="switch">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </header>
  );
}
