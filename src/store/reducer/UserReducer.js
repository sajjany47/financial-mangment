import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: { data: {}, acccessToken: "", refreshToken: "" },
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
