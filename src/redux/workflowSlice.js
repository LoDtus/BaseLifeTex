import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createWorkflowTransition,
  updateWorkflowTransition,
  deleteWorkflowTransition,
  getWorkflowTransitionsByWorkflowId, // bạn cần tự implement service này nếu chưa có
  deleteAllWorkflowTransitions
} from "@/services/workflowService";

const initialState = {
  workflowId: null,
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
      return transitions.data;
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
export const deleteAllWorkflowTransitionsThunk = createAsyncThunk(
  "workflow/deleteAllTransitions",
  async (workflowId, thunkAPI) => {
    try {
      const result = await deleteAllWorkflowTransitions(workflowId);
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
    clearWorkflowTransitions: (state) => {
      state.transitions = [];
    },
    setWorkflowTransitions: (state, action) => {
      state.transitions = action.payload;
    },
    // setWorkflowId: (state, action) => {
    //   state.workflowId = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder

      // Transitions
      .addCase(deleteAllWorkflowTransitionsThunk.pending, (state) => {
  state.loadingTransitions = true;
  state.errorTransitions = null;
})
.addCase(deleteAllWorkflowTransitionsThunk.fulfilled, (state, action) => {
  state.transitions = []; // Xóa sạch transitions trong Redux store
  state.loadingTransitions = false;
})
.addCase(deleteAllWorkflowTransitionsThunk.rejected, (state, action) => {
  state.loadingTransitions = false;
  state.errorTransitions = action.payload;
})
      .addCase(fetchWorkflowTransitions.pending, (state) => {
        state.loadingTransitions = true;
        state.errorTransitions = null;
      })
      .addCase(fetchWorkflowTransitions.fulfilled, (state, action) => {
         state.transitions = action.payload || []; // lấy mảng data
  state.loadingTransitions = false;
      })
      .addCase(fetchWorkflowTransitions.rejected, (state, action) => {
        state.loadingTransitions = false;
        state.errorTransitions = action.payload;
      })
      .addCase(addWorkflowTransition.pending, (state) => {
        state.loadingTransitions = true;
        state.errorTransitions = null;
      })
      .addCase(addWorkflowTransition.fulfilled, (state, action) => {
        state.transitions.push(action.payload);
        state.loadingTransitions = false;
      })
      .addCase(addWorkflowTransition.rejected, (state, action) => {
        state.loadingTransitions = false;
        state.errorTransitions = action.payload;
      })
      .addCase(editWorkflowTransition.pending, (state) => {
        state.loadingTransitions = true;
        state.errorTransitions = null;
      })
      .addCase(editWorkflowTransition.fulfilled, (state, action) => {
        const index = state.transitions.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.transitions[index] = action.payload;
        }
        state.loadingTransitions = false;
      })
      .addCase(editWorkflowTransition.rejected, (state, action) => {
        state.loadingTransitions = false;
        state.errorTransitions = action.payload;
      })
      .addCase(removeWorkflowTransition.pending, (state) => {
        state.loadingTransitions = true;
        state.errorTransitions = null;
      })
      .addCase(removeWorkflowTransition.fulfilled, (state, action) => {
        state.transitions = state.transitions.filter(
          (t) => t._id !== action.payload
        );
        state.loadingTransitions = false;
      })
      .addCase(removeWorkflowTransition.rejected, (state, action) => {
        state.loadingTransitions = false;
        state.errorTransitions = action.payload;
      });
    
      
  },
});

export const {
  clearWorkflowSteps,
  clearWorkflowTransitions,
  setWorkflowTransitions,
  // setWorkflowId,
} = workflowSlice.actions;
export default workflowSlice.reducer;