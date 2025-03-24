import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { refreshToken } from "./authService";

const API_URL = import.meta.env.VITE_BACKEND_URL;
let hasRedirected = false;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED" && error.message.includes("timeout"))
        toast.error("⏳ Kết nối quá thời gian! Vui lòng thử lại.");
      if (!hasRedirected) {
        hasRedirected = true;
        // setTimeout(() => {
        //     window.location.href = "/error-timeout";
        // }, 1500);
      }
    } else if (error.response) {
      switch (error.response.status) {
        case 404:
          toast.error("❌ Không tìm thấy trang yêu cầu!");
          break;
        case 401:
          toast.error("🔒 Bạn cần đăng nhập!");
          break;
        case 403:
          toast.error("🚫 Bạn không có quyền truy cập!");
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
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("accessToken");

    if (accessToken) {
      let decodedToken;
      try {
        decodedToken = jwtDecode(accessToken);
      } catch (error) {
        console.error("Lỗi decode token:", error);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/";
        return Promise.reject(error);
      }

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshTokenValue = Cookies.get("refreshToken");
            if (!refreshTokenValue)
              throw new Error("Refresh token không tồn tại!");

            const data = await refreshToken(refreshTokenValue);
            accessToken = data.accessToken;
            Cookies.set("accessToken", accessToken, {
              expires: 1,
              path: "/",
            });

            isRefreshing = false;
            refreshSubscribers.forEach((callback) => callback(accessToken));
            refreshSubscribers = [];
          } catch (error) {
            console.error("Lỗi refresh token:", error);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            window.location.href = "/";
            isRefreshing = false;
            return Promise.reject(error);
          }
        }

        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            config.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(config);
          });
        });
      }

      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
