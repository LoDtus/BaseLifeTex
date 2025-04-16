import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteProjectById,
  getLstProject,
  createNewProject,
  updateProjectById,
} from "../services/projectService";
import { getTasksByProject, searchTasks } from "../services/taskService";

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

export const createProject = createAsyncThunk(
  "project/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createNewProject(payload); // Gọi API tạo project
      return res.data; // Trả về dữ liệu project mới
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateProject = createAsyncThunk(
  "project/update",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const res = await updateProjectById(projectId, projectData); // Gọi API
      return res; // Trả về dự án đã được cập nhật
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
    selectedProjectId: null,
  },
  reducers: {
    setListProjectByUser: (state, action) => {
      state.listProject = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProjectId = action.payload;
    },
  },
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
        state.listProject = action.payload;
        state.searchQuery = action.meta.arg.searchQuery;
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
      })
      .addCase(createProject.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listProject.push(action.payload); // Thêm project mới vào danh sách
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isFetching = false;
        // Tìm và cập nhật lại dự án trong listProject
        const updatedProject = action.payload;
        state.listProject = state.listProject.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );
      });
  },
});

export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
