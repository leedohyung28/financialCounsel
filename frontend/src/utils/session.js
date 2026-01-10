// 세션 설정
export const setSession = (sessionName, param, minute) => {
  const now = new Date().getTime();
  const sessionData = {
    userId: param, // param
    expiry: now + minute * 60 * 1000, // 현재 시간 + minute분(ms)
  };

  console.log("sessionData : ", sessionData);

  // 객체를 문자열로 변환하여 저장
  sessionStorage.setItem(sessionName, JSON.stringify(sessionData));
};

export const getSession = (sessionName) => {
  const sessionStr = sessionStorage.getItem(sessionName);

  if (!sessionStr) return null;

  const session = JSON.parse(sessionStr);
  const now = new Date().getTime();

  // 현재 시간이 만료 시간보다 크면 세션 파기
  if (now > session.expiry) {
    sessionStorage.removeItem(sessionName);
    return null;
  }

  return session;
};

export const logout = () => {
  sessionStorage.removeItem("userSession");
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
