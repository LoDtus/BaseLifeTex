import axiosInstance from "./apiService";
import axios from "axios";
import { toast } from "react-toastify";
import {
    loginFail,
    loginStart,
    loginSuccess,
    registerFail,
    registerStart,
    registerSuccess,
    logOutStart,
    logOutSuccess,
    logOutFail,
} from "../redux/authSlice";
import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axiosInstance.post(`${backendUrl}/auth/login`, user);
        const userRole = res.data.data.user.role;
        dispatch(loginSuccess(res.data));
        setTimeout(() => {
            navigate("/home");
            toast.success("Đăng nhập thành công");
        }, 1000);
        return { success: true, role: userRole };
    } catch (err) {
        dispatch(loginFail());
        toast.error(err);
        return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng!" };
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post(`${backendUrl}/auth/register`, user);
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
        const res = await axiosInstance.post(
            `/auth/refresh-token`,
            {},
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error("🔒 Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
        } else {
            toast.error("⚠ Không thể làm mới token, vui lòng thử lại.");
        }
        throw error;
    }
};

export const logoutUser = async (dispatch, navigate, accessToken) => {
    if (!accessToken) {
        toast.warn("⚠ Không tìm thấy accessToken. Vui lòng đăng nhập lại!");
        return;
    }

    dispatch(logOutStart());
    try {
        await axiosInstance.post(
            "/auth/logout",
            {},
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        dispatch(logOutSuccess());
        toast.success("Đăng xuất thành công!");

        localStorage.clear();
        sessionStorage.clear();
        Object.keys(Cookies.get()).forEach((cookieName) => {
            Cookies.remove(cookieName, { path: "/" }); // Xóa cookie toàn cục
            Cookies.remove(cookieName); // Xóa cookie với path mặc định
        });
        navigate("/");
    } catch (err) {
        dispatch(logOutFail());
        toast.error(
            "Đăng xuất thất bại: " +
            (err.response?.data?.message || "Lỗi không xác định")
        );
        throw err;
    }
};

export const updateUserInfo = createAsyncThunk(
    "auth/updateUserInfo",
    async ({ data, accessToken }, thunkAPI) => {
      try {
        const res = await axios.put(
          "http://localhost:5000/api/v1/users/update-profile",
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        // ✅ Cập nhật lại redux với user mới
        const currentUser = thunkAPI.getState().auth.login.currentUser;
        const updatedUser = {
          ...currentUser,
          data: {
            ...currentUser.data,
            user: res.data.data,
          },
        };
  
        thunkAPI.dispatch(loginSuccess(updatedUser)); // cập nhật lại redux
  
        return res.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
    }
  );
  
  
