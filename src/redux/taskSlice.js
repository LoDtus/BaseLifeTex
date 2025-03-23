import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLisTaskById } from "../apis/Issue";
import { filterTask } from "../services/taskService";

export const getListTaskByProjectIdRedux = createAsyncThunk(
  "task/list",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getLisTaskById(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const filterTaskInProject = createAsyncThunk(
  "task/filterTaskInProject",
  async ({ projectId, data }) => {
    // Nhận object
    try {
      console.log("Project ID:", projectId);
      console.log("Filters:", data);
      const response = await filterTask(projectId, data);
      return response.task;
    } catch (error) {
      console.log(error);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    listTask: [],
    listComment: [],
    isFetching: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListTaskByProjectIdRedux.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getListTaskByProjectIdRedux.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = action.payload;
      })
      .addCase(getListTaskByProjectIdRedux.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(filterTaskInProject.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(filterTaskInProject.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = action.payload;
      })
      .addCase(filterTaskInProject.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
