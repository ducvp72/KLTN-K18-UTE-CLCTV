import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    key: "",
    status: "All",
    data: [],
  },
  reducers: {
    searchFilterChange: (state, action) => {
      state.key = action.payload;
    },
  },
});

export const { searchFilterChange } = filterSlice.actions;

export default filterSlice.reducer;
