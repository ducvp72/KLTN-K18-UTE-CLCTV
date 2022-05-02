import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    queryInput: "",
    data: [],
  },
  reducers: {
    searchFilterChange: (state, action) => {
      state.queryInput = action.payload;
    },
  },
});

export const { searchFilterChange } = filterSlice.actions;

export default filterSlice.reducer;
