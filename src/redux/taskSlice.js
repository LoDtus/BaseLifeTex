import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterTask,
  getTasksByProject,
  deleteManyTasks,
  searchTasks,
} from "../services/taskService";

export const getListTaskByProjectIdRedux = createAsyncThunk(
  "task/list",
  async (projectId, { rejectWithValue }) => {
    console.log("getListTaskByProjectIdRedux");
    
    try {
      const response = await getTasksByProject(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const filterTaskInProject = createAsyncThunk(
  "task/filterTaskInProject",
  async ({ projectId, data }) => {
    const response = await filterTask(projectId, data);
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

export const searchTasksInProject = createAsyncThunk(
  "task/search",
  async ({ searchQuery, idProject }, { rejectWithValue }) => {
    console.log("searchTasksInProject" + " " + searchQuery + " " + idProject);
    
    try {
      let result;
      if (!searchQuery) {
        result = await getTasksByProject(idProject);
      } else {
        result = await searchTasks(searchQuery);
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
    listComment: [],
    isFetching: false,
    total:0,
    limit:10,
    page:0,
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
      })

      .addCase(deleteManyTasksRedux.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteManyTasksRedux.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = state.listTask.filter(
          (task) => !action.payload.includes(task.id)
        );
      })
      .addCase(deleteManyTasksRedux.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      .addCase(searchTasksInProject.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(searchTasksInProject.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isFetching = false;
        state.listTask = action.payload; // bla bla
      })
      .addCase(searchTasksInProject.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
