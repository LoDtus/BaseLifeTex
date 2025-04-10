import { createSlice } from "@reduxjs/toolkit";

const viewModeSlice = createSlice({
  name: "viewMode",
  initialState: {
    mode: "kanban", // hoặc 'list', 'calendar' v.v.
  },
  reducers: {
    setViewMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setViewMode } = viewModeSlice.actions;
export default viewModeSlice.reducer;
