import { createSlice } from "@reduxjs/toolkit";

const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    transitions: [],
  },
  reducers: {
    setTransitions: (state, action) => {
      state.transitions = action.payload;
    },
    addTransition: (state, action) => {
      state.transitions.push(action.payload);
    },
    editTransition: (state, action) => {
      const { index, updated } = action.payload;
      state.transitions[index] = updated;
    },
    deleteTransition: (state, action) => {
      state.transitions.splice(action.payload, 1);
    },
    clearTransitions: (state) => {
      state.transitions = [];
    },
    resetTransitions: (state) => {
      state.transitions = [];
    },
  },
});

export const {
  setTransitions,
  addTransition,
  editTransition,
  deleteTransition,
  clearTransitions,
  resetTransitions,
} = workflowSlice.actions;

export default workflowSlice.reducer;
