import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
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
  },
  reducers: {
    // Login
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.role = action.payload.data.user.role;
      state.login.error = false;
    },
    loginFail: (state) => {
      state.login.error = true;
      state.login.isFetching = false;
    },

    // Register
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

    // Logout
    logOutStart: (state) => {
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

    updateUserStart: (state) => {
      state.login.isFetching = true;
    },
    updateUserSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser.data.user = action.payload;
    },    
    updateUserFail: (state) => {
      state.login.isFetching = false;
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
  updateUserStart, updateUserSuccess, updateUserFail
} = authSlice.actions;

export default authSlice.reducer;