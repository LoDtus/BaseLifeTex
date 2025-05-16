import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createWorkflowTransition,
  updateWorkflowTransition,
  deleteWorkflowTransition,
  getWorkflowTransitionsByWorkflowId, // bạn cần tự implement service này nếu chưa có
} from "@/services/workflowService";

const initialState = {
  transitions: [],
  currentWorkflow: null,
  loadingTransitions: false,
  errorTransitions: null,
};

// Async thunks cho transitions
export const fetchWorkflowTransitions = createAsyncThunk(
  "workflow/fetchTransitions",
  async (workflowId, thunkAPI) => {
    try {
      const transitions = await getWorkflowTransitionsByWorkflowId(workflowId);
      return transitions;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const addWorkflowTransition = createAsyncThunk(
  "workflow/addTransition",
  async (data, thunkAPI) => {
    try {
      const transition = await createWorkflowTransition(data);
      return transition;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const editWorkflowTransition = createAsyncThunk(
  "workflow/editTransition",
  async ({ id, data }, thunkAPI) => {
    try {
      const updated = await updateWorkflowTransition(id, data);
      return updated;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const removeWorkflowTransition = createAsyncThunk(
  "workflow/deleteTransition",
  async (id, thunkAPI) => {
    try {
      await deleteWorkflowTransition(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    clearWorkflowTransitions: (state) => {
      state.transitions = [];
    },
    setWorkflowTransitions: (state, action) => {
      state.transitions = action.payload;
    },
    setWorkflowId: (state, action) => {
      state.workflowId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Transitions
      .addCase(fetchWorkflowTransitions.pending, (state) => {
        state.loadingTransitions = true;
        state.errorTransitions = null;
      })
      .addCase(fetchWorkflowTransitions.fulfilled, (state, action) => {
        state.transitions = action.payload;
        state.loadingTransitions = false;
      })
      .addCase(fetchWorkflowTransitions.rejected, (state, action) => {
        state.loadingTransitions = false;
        state.errorTransitions = action.payload;
      })
      .addCase(addWorkflowTransition.fulfilled, (state, action) => {
        state.transitions.push(action.payload);
      })
      .addCase(editWorkflowTransition.fulfilled, (state, action) => {
        const index = state.transitions.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.transitions[index] = action.payload;
        }
      })
      .addCase(removeWorkflowTransition.fulfilled, (state, action) => {
        state.transitions = state.transitions.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export const {
  clearWorkflowSteps,
  clearWorkflowTransitions,
  setWorkflowTransitions,
} = workflowSlice.actions;
export default workflowSlice.reducer;
