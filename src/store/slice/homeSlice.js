import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { useSelector } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;

export const getDashbordData = createAsyncThunk("auth/getDashbordData", async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/trade/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const dashboardUpdateData = createAsyncThunk(
  "auth/getDashboardData",
  async (data) => {
    const response = await axios.get(`${apiUrl}/trade/dashboard/${data.values}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data?.token}`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
      },
    });
    return response.data;
  }
);

const homeSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {},
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashbordData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getDashbordData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getDashbordData.rejected, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })

      .addCase(dashboardUpdateData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(dashboardUpdateData.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.isLoading = false;
      })
      .addCase(dashboardUpdateData.rejected, (state, action) => {
        state.data = action?.payload;
        state.isLoading = false;
      })
  },
});

export default homeSlice.reducer;
