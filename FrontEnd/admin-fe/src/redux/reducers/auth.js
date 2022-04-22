import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "filter",
  initialState: {
    data: [],
  },
  reducers: {
    saveUser: (state, action) => {
      state.key = action.payload;
    },
  },
});

export const { saveUser } = authSlice.actions;

export default authSlice.reducer;
