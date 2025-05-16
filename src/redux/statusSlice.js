// src/redux/slices/workflowSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllWorkflowSteps,
  createWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
} from "@/services/workflowService";

const initialState = {
  currentWorkflow: null,
  workflowId: null,
  steps: [],
  loading: false,
  error: null,
};

export const fetchWorkflowByProject = createAsyncThunk(
  "workflow/fetchByProject",
  async (projectId, thunkAPI) => {
    try {
      const workflow = await getWorkflowByProject(projectId);
      return workflow;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchWorkflowSteps = createAsyncThunk(
  "workflow/fetchSteps",
  async (workflowId, thunkAPI) => {
    try {
      const steps = await getAllWorkflowSteps(workflowId);
      return steps;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const addWorkflowStep = createAsyncThunk(
  "workflow/addStep",
  async (data, thunkAPI) => {
    console.log("Gửi payload tạo workflow step:", data);
    try {
      const step = await createWorkflowStep(data);
      return step.data; // thường trả về step.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editWorkflowStep = createAsyncThunk(
  "workflow/editStep",
  async ({ workflowStepId, data }, thunkAPI) => {
    try {
      const updated = await updateWorkflowStep(workflowStepId, data);
      return updated;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const removeWorkflowStep = createAsyncThunk(
  "workflow/deleteStep",
  async (workflowStepId, thunkAPI) => {
    try {
      await deleteWorkflowStep(workflowStepId);
      return workflowStepId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    clearWorkflowSteps: (state) => {
      state.steps = [];
      state.workflowId = null;
    },
    setWorkflowId: (state, action) => {
      state.workflowId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflowByProject.fulfilled, (state, action) => {
        state.currentWorkflow = action.payload; // lưu lại workflow hiện tại
      })
      .addCase(fetchWorkflowSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowSteps.fulfilled, (state, action) => {
        console.log("✅ Kết quả fetchWorkflowSteps:", action.payload); // Kiểm tra xem có phải mảng không
        state.steps = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })

      .addCase(fetchWorkflowSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addWorkflowStep.fulfilled, (state, action) => {
        state.steps.push(action.payload);
      })
      .addCase(editWorkflowStep.fulfilled, (state, action) => {
        const index = state.steps.findIndex(
          (step) => step._id === action.payload._id
        );
        if (index !== -1) {
          state.steps[index] = action.payload;
        }
      })
      .addCase(removeWorkflowStep.fulfilled, (state, action) => {
        state.steps = state.steps.filter((step) => step._id !== action.payload);
      });
  },
});

export const { clearWorkflowSteps, setWorkflowId } = workflowSlice.actions;

export default workflowSlice.reducer;
