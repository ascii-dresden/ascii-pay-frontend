import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  revealAllHiddenFields: boolean;
}

const initialState: AdminState = {
  revealAllHiddenFields: false,
};

export const adminSlice = createSlice({
  initialState,
  name: "adminSlice",
  reducers: {
    toggleRevealAllHiddenFields: (state) => {
      state.revealAllHiddenFields = !state.revealAllHiddenFields;
    },
  },
});

export default adminSlice.reducer;

export const { toggleRevealAllHiddenFields } = adminSlice.actions;
