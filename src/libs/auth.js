import { api } from "./api";

export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await api.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("ユーザー情報取得失敗：", error);
    return null;
  }
};
