import api from "../utils/axios";

export const clientApi = {
  // ID, 비밀번호 확인
  loginClient: async (id, password) => {
    const response = await api.post("/api/client/login", {
      email: id,
      password,
    });
    return response.data;
  },

  // ID 확인
  validId: async (id) => {
    const response = await api.post("/api/client/search/email", { email: id });
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
  searchClient: async (id) => {
    const response = await api.post("/api/client/search", { email: id });
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
  setupOtp: async (userId) => {
    const response = await api.post("/api/otp/setup", { email: userId });
    return response.data;
  },

  // OTP 인증
  verifyInitOtp: async (userId, code) => {
    const response = await api.post("/api/otp/verify-init", {
      email: userId,
      code,
    });
    return response.data;
  },

  // OTP 인증
  verifyOtp: async (userId, code) => {
    const response = await api.post("/api/otp/verify", { email: userId, code });
    return response.data;
  },

  updateSecretKey: async (userId, secretKey, code) => {
    const response = await api.post("/api/otp/update", {
      email: userId,
      secretKey,
      code,
    });
    return response.data;
  },
};
