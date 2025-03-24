import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./authService";
import { loginSuccess } from "../redux/authSlice";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const createAxiosInstance = (dispatch, getState) => {
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const currentUser = getState().auth.user;
      if (!currentUser?.accessToken) return config;

      try {
        const decodedToken = jwtDecode(currentUser.accessToken);
        const now = Date.now() / 1000;

        if (decodedToken.exp < now) {
          const data = await refreshToken();
          dispatch(
            loginSuccess({ ...currentUser, accessToken: data.accessToken })
          );

          config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        } else {
          config.headers["Authorization"] = `Bearer ${currentUser.accessToken}`;
        }
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        if (
          error.code === "ECONNABORTED" &&
          error.message.includes("timeout")
        ) {
          toast.error("⏳ Kết nối quá thời gian! Vui lòng thử lại.");
        }
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error("🔒 Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
            break;
          case 403:
            toast.error("🚫 Bạn không có quyền truy cập!");
            break;
          case 404:
            toast.error("❌ Không tìm thấy trang yêu cầu!");
            break;
          case 500:
            toast.error("💥 Lỗi máy chủ! Vui lòng thử lại sau.");
            break;
          default:
            toast.error("⚠️ Lỗi không xác định! Vui lòng thử lại.");
        }
      } else {
        toast.error("📶 Không thể kết nối đến máy chủ!");
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
