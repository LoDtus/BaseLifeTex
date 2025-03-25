import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLstProject } from "../apis/project";

export const getListProjectByUser = createAsyncThunk(
  "/project/list",
  async ({ rejectWithValue }) => {
    try {
      const res = await getLstProject();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    listProject: [],
    error: null,
    isFetching: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListProjectByUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getListProjectByUser.fulfilled, (state, action) => {
        console.log("Check data", action.payload);
        state.isFetching = false;
        state.listProject = action.payload;
      })
      .addCase(getListProjectByUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
