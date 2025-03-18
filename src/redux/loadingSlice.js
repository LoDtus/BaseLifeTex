import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false
};

const loadingSlice = createSlice({
    name: "loading",
    initialState: initialState,
    reducer: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;