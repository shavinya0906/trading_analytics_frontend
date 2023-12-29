import { createSlice } from "@reduxjs/toolkit";

const calculatorSlice = createSlice({
  name: "calculator",
  initialState: {
    data: [],
    isAddedOrEdited: false,
    isLoading: true,
    currentTab: "Profit & Loss"
  },
  reducers: {
    loadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    addCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});
export const { loadingStatus, addCurrentTab } = calculatorSlice.actions;
export default calculatorSlice.reducer;
