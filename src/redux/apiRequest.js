import axios from "axios";
const Api_Login = import.meta.env.VITE_API_LOGIN;
const Api_Register = import.meta.env.VITE_API_REGISTER;
import {
  loginFail,
  loginStart,
  loginSuccess,
  registerFail,
  registerStart,
  registerSuccess,
} from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${Api_Login}`, user);
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
    await axios.post(`${Api_Register}`, user);
    dispatch(registerSuccess());
    setTimeout(() => {
      navigate("/");
    }, 4000);
  } catch (error) {
    dispatch(registerFail());
    alert(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký.");
  }
};
