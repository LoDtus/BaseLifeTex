import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterTask,
  deleteManyTasks,
  getTaskByPagination,
  searchTasks,
  deleteTaskById,
} from "../services/taskService";

export const getListTaskByProjectId = createAsyncThunk(
  "task/list",
  async ({ projectId, page, limit }, { rejectWithValue }) => {
    const response = await getTaskByPagination(projectId, +page, +limit);
    if (response.success) {
      return {
        listTask: response.data,
        page: page,
        limit: limit,
        total: response.total,
      };
    } else {
      return rejectWithValue(response.message);
    }
  }
);

export const filterTaskInProject = createAsyncThunk(
  "task/filterTaskInProject",
  async ({ projectId, data, page, limit }) => {
    const response = await filterTask(projectId, +page, +limit, data);
    return response.data;
  }
);

export const deleteManyTasksRedux = createAsyncThunk(
  "task/deleteMany",
  async (ids, { rejectWithValue }) => {
    const result = await deleteManyTasks(ids);

    if (result.success) {
      return ids;
    } else {
      return rejectWithValue(result.error);
    }
  }
);
export const deleteTaskByIdRedux = createAsyncThunk(
  "task/deleteOne",
  async (taskId, { rejectWithValue }) => {
    const response = await deleteTaskById(taskId);
    if (response.success) {
      return taskId;
    } else {
      return rejectWithValue(response.message);
    }
  }
);
export const searchTasksInProject = createAsyncThunk(
  "task/search",
  async ({ keyword, idProject, limit }, { rejectWithValue }) => {
    try {
      let result;
      if (!keyword) {
        result = await getTaskByPagination(idProject, 1, limit);
      } else {
        result = await searchTasks(keyword, idProject, limit, 1);
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

const taskSlice = createSlice({
  name: "task",
  initialState: {
    listTask: [],
    searchQuery: "", // Thêm searchQuery để lưu từ khóa tìm kiếm
    isFetching: false,
    total: 0,
    limit: 20,
    page: 1,
    error: null,
    isTaskFormOpen: false,
  },
  reducers: {
    changePage: (state, action) => {
      state.page = action.payload + 1;
    },
    changeRowPerPage: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    openTaskForm: (state) => {
      state.isTaskFormOpen = true;
    },
    closeTaskForm: (state) => {
      state.isTaskFormOpen = false;
    },
      updateTaskStatusLocal: (state, action) => {
    const { taskId, newStatus } = action.payload;
    const task = state.listTask.find((t) => t._id === taskId);
    if (task) {
      task.status = newStatus;
    }
  },
  },

  extraReducers: (builder) => {
    builder // Get List Task
      .addCase(getListTaskByProjectId.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getListTaskByProjectId.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = action.payload.listTask;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getListTaskByProjectId.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      }) // Filter Tasks
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
      }) // Delete Many Tasks
      .addCase(deleteManyTasksRedux.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteManyTasksRedux.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = state.listTask.filter(
          (task) => !action.payload.includes(task._id)
        );
      })
      .addCase(deleteManyTasksRedux.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskByIdRedux.fulfilled, (state, action) => {
        state.listTask = state.listTask.filter(
          (task) => task._id !== action.payload
        );
      })
      .addCase(deleteTaskByIdRedux.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Search Tasks
      .addCase(searchTasksInProject.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(searchTasksInProject.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = action.payload;
        state.searchQuery = action.meta.arg.searchQuery; // Lưu lại từ khóa tìm kiếm
      })
      .addCase(searchTasksInProject.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { changePage, changeRowPerPage,updateTaskStatusLocal, openTaskForm, closeTaskForm } =
  taskSlice.actions;
export default taskSlice.reducer;
