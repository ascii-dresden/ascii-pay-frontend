import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  revealAllHiddenFields: boolean;
  language: string;
}

const initialState: AdminState = {
  revealAllHiddenFields: false,
  language: window.navigator.language,
};

export const adminSlice = createSlice({
  initialState,
  name: "adminSlice",
  reducers: {
    toggleRevealAllHiddenFields: (state) => {
      state.revealAllHiddenFields = !state.revealAllHiddenFields;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export default adminSlice.reducer;

export const { toggleRevealAllHiddenFields, setLanguage } = adminSlice.actions;
