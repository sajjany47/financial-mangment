import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addUser: { type: "", role: "", id: "", data: {} },
};

export const addUserSlice = createSlice({
  name: "addUser",
  initialState: initialState,
  reducers: {
    setAddUser: (state, action) => {
      state.addUser = action.payload;
    },
  },
});

export const { setAddUser } = addUserSlice.actions;
export default addUserSlice.reducer;
