import axios from "axios";
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
    const res = await axios.post("https://dummyjson.com/auth/login", user);
    dispatch(loginSuccess(res.data));

    setTimeout(() => {
      navigate("/");
    }, 1000);

    return { success: true };
  } catch (err) {
    dispatch(loginFail());
    return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng!" };
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("/", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(registerFail());
  }
};
