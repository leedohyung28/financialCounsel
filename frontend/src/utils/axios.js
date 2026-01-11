import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 인터셉터로 인증 토큰 추가 (옵션)
// api.interceptors.request.use(config => {
//   // const token = localStorage.getItem('token');
//   // if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
