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
  },
  reducers: {
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
  },
});

export const {
  loginStart,
  loginFail,
  loginSuccess,
  registerFail,
  registerStart,
  registerSuccess,
} = authSlice.actions;
export default authSlice.reducer;
