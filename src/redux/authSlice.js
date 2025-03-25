import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
    logout: {
      // Thêm trạng thái logout
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    // Reducers cho login
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFail: (state) => {
      state.login.error = true;
      state.login.isFetching = false;
    },

    // Reducers cho register
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFail: (state) => {
      state.register.error = true;
      state.register.isFetching = false;
      state.register.success = false;
    },

    // Reducers cho logout
    logOutStart: (state) => {
      if (!state.logout) {
        state.logout = { isFetching: false, error: false };
      }
      state.logout.isFetching = true;
    },
    logOutSuccess: (state) => {
      state.logout.isFetching = false;
      state.login.currentUser = null;
      state.logout.error = false;
    },
    logOutFail: (state) => {
      state.logout.isFetching = false;
      state.logout.error = true;
    },
  },
});

export const {
  loginStart,
  loginFail,
  loginSuccess,
  registerFail,
  registerStart,
  registerSuccess,
  logOutStart,
  logOutSuccess,
  logOutFail,
} = authSlice.actions;

export default authSlice.reducer;
