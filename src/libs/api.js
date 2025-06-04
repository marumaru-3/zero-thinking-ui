import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost",
});

// リクエストインターセプターを使ってトークンがあればヘッダーに追加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
