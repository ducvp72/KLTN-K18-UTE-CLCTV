import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    show: false,
  },
  reducers: {
    openToggle: (state, action) => {
      state.show = action.payload;
    },
  },
});

export const { openToggle } = toggleSlice.actions;

export default toggleSlice.reducer;
