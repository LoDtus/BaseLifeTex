import axiosInstance from "./apiService";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

import {
  loginFail,
  loginStart,
  loginSuccess,
  registerFail,
  registerStart,
  registerSuccess,
} from "../redux/authSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("/auth/sign-in", user);
    dispatch(loginSuccess(res.data));

    setTimeout(() => {
      navigate("/home");
    }, 2000);

    return { success: true };
  } catch (err) {
    dispatch(loginFail());
    return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng!" };
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axiosInstance.post("/auth/sign-up", user);
    dispatch(registerSuccess());
    setTimeout(() => {
      navigate("/");
    }, 4000);
  } catch (error) {
    dispatch(registerFail());

    const errorMessage = error.response?.data?.message;

    if (errorMessage?.includes("da duoc dang")) {
      toast.warn(`Email đã được đăng ký. Bạn có muốn đăng nhập không?`, {
        autoClose: 5000,
        closeOnClick: true,
        onClick: () => navigate("/"),
      });
    } else {
      toast.error(errorMessage || "Có lỗi xảy ra, vui lòng thử lại.");
    }
    throw new Error(errorMessage || "Có lỗi xảy ra");
  }
};
export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("🔄 Lỗi refresh token:", error);

    if (error.response?.status === 401) {
      toast.error("🔒 Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
    } else {
      toast.error("⚠ Không thể làm mới token, vui lòng thử lại.");
    }

    throw error;
  }
};
