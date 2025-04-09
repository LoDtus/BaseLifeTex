import { createSlice } from "@reduxjs/toolkit";

const propertiesSlice = createSlice({
    name: "properties",
    initialState: {
        openProjectMenu: true,
        taskState: 'CLOSE',
    },
    reducers: {
        setOpenProjectMenu: (state, action) => {
            state.openProjectMenu = action.payload;
        },
        setTaskForm: (state, action) => {
            state.taskState = action.payload;
        },
    }
});

export const {
    setOpenProjectMenu,
    setTaskForm,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;