import { createSlice } from "@reduxjs/toolkit";

export const search = createSlice({
  name: "search",
  initialState: {
    value: {
      page: "",
      filterOptions: {},
      pageNumber: 1,
      firstPage: 0,
      rows: 10,
      sortOrder: 1,
      sortField: "name",
      reset: false,
    },
  },
  reducers: {
    setSearch: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSearch } = search.actions;

export default search.reducer;
