import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const tradingAccountList = createAsyncThunk(
  "tradingAccount/tradingAccountList",
  async (token) => {
    const response = await axios.get(`${apiUrl}/trading-account`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    console.log("===> I'm response", response)
    return response;
  }
);

export const tradingAccountAdd = createAsyncThunk(
  "tradingAccount/tradingAccountAdd",
  async (data) => {
    const response = await axios.post(`${apiUrl}/trading-account`, data?.values, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data?.token}`,
      },
    });
    return response;
  }
);

export const tradingAccountEdit = createAsyncThunk(
  "tradingAccount/tradingAccountEdit",
  async (data) => {
    const response = await axios.put(`${apiUrl}/trading-account/update/`, data?.values, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data?.token}`,
      },
    });
    return response;
  }
);

export const tradingAccountUpdateFilter = createAsyncThunk(
  "tradingAccount/tradingAccountFilter",
  async (data) => {
    console.log(data)
    const response = await axios.get(`${apiUrl}/trading-account/${data.values}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data?.toke}`,
      },
    });
    return response;
  }
);

const tradingAccountSlice = createSlice({
  name: "tradingAccount",
  initialState: {
    data: [],
    payloadHold: [],
    isAddedOrEdited: false,
    isLoading: false
  },
  reducers: {
    addNewData: (state, action) => {
      state.payloadHold = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tradingAccountList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(tradingAccountList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(tradingAccountList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(tradingAccountAdd.pending, (state, action) => {
        state.isLoading = true;
        // state.isAddedOrEdited = false;
      })
      .addCase(tradingAccountAdd.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isAddedOrEdited = true;
        // state.data = action?.payload?.data;
      })
      .addCase(tradingAccountAdd.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(tradingAccountEdit.pending, (state, action) => {
        state.isLoading = true;
        state.isAddedOrEdited = false;
      })
      .addCase(tradingAccountEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
        // state.data = action?.payload?.data;
      })
      .addCase(tradingAccountEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      });
  },
});

export default tradingAccountSlice.reducer;
