import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    show: false,
    user: "",
  },
  reducers: {
    openToggle: (state, action) => {
      state.show = action.payload.show;
      state.user = action.payload.user;
    },
  },
});

export const { openToggle } = toggleSlice.actions;

export default toggleSlice.reducer;
