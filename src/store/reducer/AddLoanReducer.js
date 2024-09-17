import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addLoan: { type: "", loanId: "", data: {} },
};

export const addLoanSlice = createSlice({
  name: "addLoan",
  initialState: initialState,
  reducers: {
    setAddLoan: (state, action) => {
      state.addLoan = action.payload;
    },
  },
});

export const { setAddLoan } = addLoanSlice.actions;

export default addLoanSlice.reducer;
