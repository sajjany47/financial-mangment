import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  acccessToken: "",
  refreshToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
      state.acccessToken = action.payload;
      state.refreshToken = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
