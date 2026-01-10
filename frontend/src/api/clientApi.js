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
    const response = await api.put("/api/client/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
