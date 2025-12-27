import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Context 생성
const ThemeContext = createContext();

// 2. Provider 컴포넌트 생성
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // 저장된 값이 없으면 시스템 설정(다크모드 선호 여부)을 확인하는 것도 좋은 방법입니다.
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));

    // index.css나 전역 스타일에 정의된 클래스를 body에 적용
    if (isDark) {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    } else {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 커스텀 훅 만들기 (사용하기 편하도록)
export function useTheme() {
  return useContext(ThemeContext);
}
