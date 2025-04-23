import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Xóa tất cả thông báo
    deleteAllNotificationsSuccess: (state) => {
      state.notifications = []; // Xóa tất cả thông báo
    },
    // Thêm các reducers khác nếu cần
  },
});

export const { deleteAllNotificationsSuccess } = notificationSlice.actions;

export default notificationSlice.reducer;
