import axiosInstance from "./apiService";
import { toast } from "react-toastify";

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
    toast.error(error.response?.data?.message);
  }
};
export const refreshToken = async () => {
  try {
    const res = await axiosInstance.post("/auth/refresh-token", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log("Lỗi refresh token", error);
    throw error;
  }
};
