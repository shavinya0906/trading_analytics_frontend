import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { useSelector } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;

export const getColumnData = createAsyncThunk("auth/getColumnData", async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/user_column`, {
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

const columnSlice = createSlice({
  name: "new_column",
  initialState: {
    data: {},
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getColumnData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getColumnData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getColumnData.rejected, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      });
  },
});

export default columnSlice.reducer;