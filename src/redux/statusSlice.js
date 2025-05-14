// redux/statusSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statuses: [
    { label: "Công việc mới", bg: "bg-blue-100", text: "text-blue-800" },
    { label: "Đang thực hiện", bg: "bg-yellow-100", text: "text-yellow-800" },
    { label: "Kiểm thử", bg: "bg-purple-100", text: "text-purple-800" },
    { label: "Hoàn thành", bg: "bg-green-100", text: "text-green-800" },
    { label: "Đóng công việc", bg: "bg-gray-100", text: "text-gray-800" },
    { label: "Tạm dừng", bg: "bg-amber-100", text: "text-amber-800" },
    { label: "Khóa công việc", bg: "bg-red-100", text: "text-red-800" },
  ],
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    addStatus: (state, action) => {
      state.statuses.push(action.payload);
    },
    editStatus: (state, action) => {
      const { oldLabel, newLabel } = action.payload;
      const index = state.statuses.findIndex((s) => s.label === oldLabel);
      if (index !== -1) {
        state.statuses[index].label = newLabel;
      }
    },
    deleteStatus: (state, action) => {
      state.statuses = state.statuses.filter((s) => s.label !== action.payload);
    },
    setStatuses: (state, action) => {
      state.statuses = action.payload;
    },
  },
});

export const { addStatus, editStatus, deleteStatus, setStatuses } =
  statusSlice.actions;
export default statusSlice.reducer;
