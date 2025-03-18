import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_URL;
let hasRedirected = false;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED" && error.message.includes("timeout"))
                toast.error('⏳ Kết nối quá thời gian! Vui lòng thử lại.');
            if (!hasRedirected) {
                hasRedirected = true;
                // setTimeout(() => {
                //     window.location.href = "/error-timeout";
                // }, 1500);
            }
        } else if (error.response) {
            switch (error.response.status) {
                case 404:
                    toast.error('❌ Không tìm thấy trang yêu cầu!');
                    break;
                case 401:
                    toast.error('🔒 Bạn cần đăng nhập!');
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

)

export default axiosInstance;