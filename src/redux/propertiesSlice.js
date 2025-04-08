import { createSlice } from "@reduxjs/toolkit";

const propertiesSlice = createSlice({
    name: "properties",
    initialState: {
        openProjectMenu: true,
    },
    reducers: {
        setOpenProjectMenu: (state, action) => {
            state.openProjectMenu = action.payload;
        },
    }
});

export const {
    setOpenProjectMenu,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;