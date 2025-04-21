import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("accessToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      accessToken: storedToken || null,
      isFetching: false,
      role: null,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
    logout: {
      isFetching: false,
      error: false,
    },
    updateUser: {
      isFetching: false,
      error: false,
      success: false,
    },
    changePassword: {
      isFetching: false,
      error: false,
      success: false,
    },
  },
  reducers: {
    // Login
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.accessToken = action.payload.accessToken;
      state.login.role = action.payload.data.user.role;
      state.login.error = false;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    loginFail: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },

    // Register
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.success = true;
      state.register.error = false;
    },
    registerFail: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },

    // Logout
    logOutStart: (state) => {
      state.logout.isFetching = true;
    },
    logOutSuccess: (state) => {
      state.logout.isFetching = false;
      state.login.currentUser = null;
      state.login.accessToken = null;
      state.login.role = null;
      localStorage.removeItem("accessToken");
    },

    // Update User
    updateUserStart: (state) => {
      state.updateUser.isFetching = true;
    },
    updateUserSuccess: (state, action) => {
      state.updateUser.isFetching = false;
      state.login.currentUser.data.user = action.payload;
      state.updateUser.success = true;
    },
    updateUserFail: (state) => {
      state.updateUser.isFetching = false;
      state.updateUser.error = true;
    },

    // Change Password
    changePasswordStart: (state) => {
      state.changePassword.isFetching = true;
      state.changePassword.success = true;
      state.changePassword.error = false;
    },
    changePasswordSuccess: (state) => {
      state.changePassword.isFetching = false;
      state.changePassword.success = true;
      state.changePassword.error = false;
    },
    changePasswordFail: (state) => {
      state.changePassword.isFetching = false;
      state.changePassword.success = false;
      state.changePassword.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFail,
  registerStart,
  registerSuccess,
  registerFail,
  logOutStart,
  logOutSuccess,
  logOutFail,
  updateUserStart,
  updateUserSuccess,
  updateUserFail,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFail,
} = authSlice.actions;

export default authSlice.reducer;
