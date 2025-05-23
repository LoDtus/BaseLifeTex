// src/redux/slices/workflowSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllWorkflowSteps,
  createWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
  addworkflow,
  deleteAllWorkflowSteps
} from "@/services/workflowService";
import { getworkflowbyid } from "../services/workflowService";

const initialState = {
  currentWorkflow: null,
  workflowId: null,
  steps: [],
   transitions: [],  
  loading: false,
  error: null,
};
export const fetchWorkflowDetail = createAsyncThunk(
  "workflow/fetchWorkflowDetail",
  async (workflowId, thunkAPI) => {
    try {
      const response = await getworkflowbyid(workflowId); // <- gọi theo ID
      return response; // { workFlowData, steps, transitions }
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  }
);
export const creatworkflow = createAsyncThunk(
  "workflow/addworkflow",
  async (projectId, thunkAPI) => {
    try {
      const response = await addworkflow({ projectId });
      return response; // response = { _id, projectId, ... }
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
      return step; // thường trả về step.data
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
export const deleteAllWorkflowStepsThunk = createAsyncThunk(
  "workflow/deleteAllTransitions",
  async (workflowId, thunkAPI) => {
    try {
      const result = await deleteAllWorkflowSteps(workflowId);
      return result.deletedCount; // hoặc return workflowId nếu bạn muốn xoá local state theo id
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    clearWorkflowSteps: (state) => {
      state.steps = [];
    },

    setWorkflowId: (state, action) => {
      state.workflowId = action.payload;
    },
      setCurrentWorkflow: (state, action) => {
    state.currentWorkflow = action.payload;
  },
  
    // setWorkflowId: (state, action) => {
    //   state.workflowId = action.payload;
    // },
    // setWorkflowId: (state, action) => {
    //   state.workflowId = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchWorkflowDetail.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchWorkflowDetail.fulfilled, (state, action) => {
  const { workFlowData, steps, transitions } = action.payload || {};
  state.currentWorkflow = workFlowData;
  state.workflowId = workFlowData?._id || null;
  state.steps = steps || [];
  state.transitions = transitions || [];
  state.loading = false;
})
.addCase(fetchWorkflowDetail.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      .addCase(creatworkflow.fulfilled, (state, action) => {
        state.workflowId = action.payload._id;
        state.currentWorkflow = action.payload;
        state.steps = []; // reset steps nếu cần
         state.transitions = [];
      })
           .addCase(deleteAllWorkflowStepsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllWorkflowStepsThunk.fulfilled, (state, action) => {
        state.steps = []; // Xóa sạch transitions trong Redux store
        state.loading = false;
      })
      .addCase(deleteAllWorkflowStepsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkflowSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowSteps.fulfilled, (state, action) => {
        console.log("✅ Kết quả fetchWorkflowSteps:", action.payload);
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
        console.log("Payload sửa step:", action.payload);
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

export const { clearWorkflowSteps, setWorkflowId,setCurrentWorkflow  } = workflowSlice.actions;

export default workflowSlice.reducer;
