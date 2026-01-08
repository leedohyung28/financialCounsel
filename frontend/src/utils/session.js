export const getValidSession = () => {
  const sessionStr = sessionStorage.getItem("userSession");

  if (!sessionStr) return null;

  const session = JSON.parse(sessionStr);
  const now = new Date().getTime();

  // 현재 시간이 만료 시간보다 크면 세션 파기
  if (now > session.expiry) {
    sessionStorage.removeItem("userSession");
    return null;
  }

  return session.userId;
};

export const logout = () => {
  sessionStorage.removeItem("userSession");
};

// 세션 설정
export const setSession = (param, sessionName, minute) => {
  const now = new Date().getTime();
  const sessionData = {
    userId: param, // param
    expiry: now + minute * 60 * 1000, // 현재 시간 + minute분(ms)
  };

  // 객체를 문자열로 변환하여 저장
  sessionStorage.setItem(sessionName, JSON.stringify(sessionData));
};

// 세션 연장
export const extendSession = (minutes = 3) => {
  const sessionStr = sessionStorage.getItem("userSession");
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    session.expiry = new Date().getTime() + minutes * 60 * 1000;
    sessionStorage.setItem("userSession", JSON.stringify(session));
    return session.expiry;
  }
  return null;
};
