import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const authAPIUrl = process.env.REACT_APP_AUTH_API_URL;
export const LoginUser = createAsyncThunk("auth/LoginUser", async (data) => {
  try {
    const response = await axios.put(`${authAPIUrl}/user/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const auth_token = response.data.auth_token; 
    return auth_token;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isLoading = false;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.token = action.payload;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
