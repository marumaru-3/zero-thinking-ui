import { api } from "@/libs/api";

export const useApi = () => {
  const getData = async (url, errorMessage = "データ取得に失敗しました") => {
    try {
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      console.error("GETエラー：", error);
      alert(errorMessage);
      throw error;
    }
  };

  const postData = async (
    url,
    payload = {},
    errorMessage = "データ登録に失敗しました",
    showAlert = true
  ) => {
    try {
      const res = await api.post(url, payload);
      return res.data;
    } catch (error) {
      console.error("POSTエラー：", error);
      if (showAlert) alert(errorMessage);
      throw error;
    }
  };

  const deleteData = async (url, errorMessage = "データ削除に失敗しました") => {
    try {
      const res = await api.delete(url);
      return res.data;
    } catch (error) {
      console.error("DELETEエラー：", error);
      alert(errorMessage);
      throw error;
    }
  };

  return {
    getData,
    postData,
    deleteData,
  };
};
