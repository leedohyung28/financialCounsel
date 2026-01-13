import api from "../utils/axios";

export const clientApi = {
  // ID, 비밀번호 확인
  loginClient: async (email, password) => {
    const response = await api.post("/api/client/login", {
      email,
      password,
    });
    return response.data;
  },

  // ID 확인
  validId: async (email) => {
    const response = await api.post("/api/client/search/email", { email });
    return response.data;
  },

  // 이메일 검증
  validEmail: async (email) => {
    const response = await api.post("/api/client/valid/email", { email });
    return response.data;
  },

  // 회원등록
  signUpClient: async (formData) => {
    const response = await api.post("/api/client/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ID로 직원 확인
  searchClient: async (email) => {
    const response = await api.post("/api/client/search", { email });
    return response.data;
  },

  // 회원 정보 수정
  updateProfile: async (formData) => {
    const response = await api.post("/api/client/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // OTP 세팅
  setupOtp: async (email) => {
    const response = await api.post("/api/otp/setup", { email });
    return response.data;
  },

  // OTP 인증
  verifyInitOtp: async (email, code) => {
    const response = await api.post("/api/otp/verify-init", {
      email,
      code,
    });
    return response.data;
  },

  // OTP 인증
  verifyOtp: async (email, code) => {
    const response = await api.post("/api/otp/verify", { email, code });
    return response.data;
  },

  // 시크릿키 업데이트
  updateSecretKey: async (email, secretKey, code) => {
    const response = await api.post("/api/otp/update", {
      email,
      secretKey,
      code,
    });
    return response.data;
  },

  // 시크릿키 존재 여부 확인
  validSecretKey: async (email) => {
    const response = await api.post("/api/otp/valid", {
      email,
    });
    return response.data;
  },

  // 이메일로 임시 패스워드 전송
  sendPwdEmail: async (email) => {
    const response = await api.post("/api/email/temp", {
      email,
    });
    return response.data;
  },
};
