import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: "",
  },
  reducers: {
    saveUser: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { saveUser } = authSlice.actions;

export default authSlice.reducer;
