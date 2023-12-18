import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const tradeAnalyticsData = createAsyncThunk(
  "tradeLog/tradeAnalyticsData",
  async (data) => {
    const response = await axios.get(
      `${apiUrl}/${data.path}?startDate=${data.data[0]}&endDate=${data.data[1]}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data.token}`,
        },
      }
    );
    return response;
  }
);

const tradeAnalyticsSlice = createSlice({
  name: "tradeAnalytics",
  initialState: {
    data: [],
    isAddedOrEdited: false,
    isLoading: true,
    currentTab: "Overview",
    monthsName: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  reducers: {
    loadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    addCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tradeAnalyticsData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(tradeAnalyticsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(tradeAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const { loadingStatus, addCurrentTab } = tradeAnalyticsSlice.actions;
export default tradeAnalyticsSlice.reducer;
