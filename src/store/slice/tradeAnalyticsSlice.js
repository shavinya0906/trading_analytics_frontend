import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const tradeAnalyticsData = createAsyncThunk(
  "tradeLog/tradeAnalyticsData",
  async (data) => {
    const response = await axios.get(`${apiUrl}/trade/trade-analytics`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.token}`,
      },
    });
    return response;
  }
);

export const updateTradeAnalyticsData = createAsyncThunk(
  "tradeLog/updateTradeAnalyticsData",
  async (data) => {
    console.log(data);
    const response = await axios.get(
      `${apiUrl}/trade/trade-analytics/${data.values}`,
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

export const getAdvancedGraphData = createAsyncThunk(
  "tradelog/getAdvancedGraphData",
  async (data) => {
    const response = await axios.get(
      `${apiUrl}/trade/get-advanced-graph/${data.values}`,
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
      })
      .addCase(updateTradeAnalyticsData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateTradeAnalyticsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(updateTradeAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
      })
      //add cases for getting advanced graph data
      .addCase(getAdvancedGraphData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAdvancedGraphData.fulfilled, (state, action) => {
        //instead of replacing the data adding the upcoming data to the existing data
        state.isLoading = false;
        state.data.graphs.getAdvancedGraphData = action?.payload?.data;
      })
      .addCase(getAdvancedGraphData.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const { loadingStatus, addCurrentTab } = tradeAnalyticsSlice.actions;
export default tradeAnalyticsSlice.reducer;
