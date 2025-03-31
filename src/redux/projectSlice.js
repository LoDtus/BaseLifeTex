import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProjectById, getLstProject } from "../services/projectService";

export const getListProjectByUser = createAsyncThunk(
  "/project/list",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await getLstProject();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProjects = createAsyncThunk(
  "project/search",
  async ({ searchQuery, idProject }, { rejectWithValue }) => {
    try {
      let result;
      if (!searchQuery) {
        result = await getTasksByProject(idProject);
      } else {
        result = await searchTasks(searchQuery, idProject); // Thêm idProject vào API tìm kiếm
      }

      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      await deleteProjectById(projectId); // Gửi request xóa
      return projectId; // Trả về projectId để cập nhật Redux
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
    searchQuery: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListProjectByUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getListProjectByUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listProject = action.payload;
      })
      .addCase(getListProjectByUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(searchProjects.pending, (state) => {
              state.isFetching = true;
            })
      .addCase(searchProjects.fulfilled, (state, action) => {
              state.isFetching = false;
              state.listProject= action.payload;
              state.searchQuery = action.meta.arg.searchQuery; // Lưu lại từ khóa tìm kiếm
            })
      .addCase(searchProjects.rejected, (state, action) => {
              state.isFetching = false;
              state.error = action.payload;
            })
      .addCase(deleteProject.fulfilled, (state, action) => {
              state.listProject = state.listProject.filter(
                (project) => project._id !== action.payload
              );
            })
      .addCase(deleteProject.rejected, (state, action) => {
              state.error = action.payload;
            });
  },
});

export default projectSlice.reducer;
