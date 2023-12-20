import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// export const tradeAnalyticsData = createAsyncThunk(
//   "tradeLog/tradeAnalyticsData",
//   async (data) => {
//     const response = await axios.get(
//       `${apiUrl}/${data.path}?startDate=${data.data[0]}&endDate=${data.data[1]}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${data.token}`,
//         },
//       }
//     );
//     return response;
//   }
// );

const toolSlice = createSlice({
  name: "tools",
  initialState: {
    data: [],
    isAddedOrEdited: false,
    isLoading: true,
    currentTab: "Sessions"
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
export const { loadingStatus, addCurrentTab } = toolSlice.actions;
export default toolSlice.reducer;
