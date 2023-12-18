import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userList = createAsyncThunk("users/userList", async () => {
  const response = axios.get("http://localhost:3000/users");
  return response;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (data) => {
  const response = await axios.delete(`http://localhost:3000/users/${data}`);
  response.data = data;
  return response;
});

export const addUser = createAsyncThunk("users/addUser", async (data) => {
  const response = await axios.post(`http://localhost:3000/users`, data);
  return response;
});

export const userListById = createAsyncThunk(
  "users/userListById",
  async (data) => {
    const response = axios.get(`http://localhost:3000/users/${data}`);
    return response;
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (data) => {
  const response = axios.put(
    `http://localhost:3000/users/${data.id}`,
    data.data
  );
  return response;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    data: {},
    isLoading: false,
  },
  reducers: {
    // omit reducer cases
  },
  extraReducers: (builder) => {
    builder
      .addCase(userList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(userList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(userListById.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(userListById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        let newData = JSON.stringify(state.data);
        newData = JSON.parse(newData);
        const index = newData?.findIndex(
          (data) => data.id === action.payload.data
        );
        newData?.splice(index, 1);
        state.data = newData;
        state.isLoading = false;
      });
  },
});

export default userSlice.reducer;
