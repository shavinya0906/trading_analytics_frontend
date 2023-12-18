import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { useSelector } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;

export const getDashbordData = createAsyncThunk("auth/getDashbordData", async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/trade/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

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
      });
  },
});

export default homeSlice.reducer;