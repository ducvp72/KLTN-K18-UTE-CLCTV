import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    queryInput: "",
    data: [],
    page: 1,
    limit: 8,
    totalPages: "",
    totalResults: "",
    sortBy: "asc",
  },
  reducers: {
    searchFilterChange: (state, action) => {
      // console.log("action.payload", action.payload);
      state.queryInput = action.payload.queryInput;
      state.data = action.payload.data;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.totalResults = action.payload.totalResults;
      state.sortBy = action.payload.sortBy;
      state.loading = action.payload.loading;
    },
  },
});

export const { searchFilterChange } = filterSlice.actions;

export default filterSlice.reducer;
