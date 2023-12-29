import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const strategyList = createAsyncThunk(
  "strategy/strategyList",
  async (token) => {
    const response = await axios.get(`${apiUrl}/strategies`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
);

export const strategyAdd = createAsyncThunk(
  "strategy/strategyAdd",
  async (data) => {
    const response = await axios.post(`${apiUrl}/strategies`, data?.values, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data?.token}`,
      },
    });
    return response;
  }
);

export const strategyEdit = createAsyncThunk(
  "strategy/strategyEdit",
  async (data) => {
    const { strategies_Id } = data.values;
    delete data.values.strategies_Id;
    const response = await axios.put(
      `${apiUrl}/strategies/update/${strategies_Id}`,
      data?.values,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data?.token}`,
        },
      }
    );
    return response;
  }
);

export const strategyRemove = createAsyncThunk(
  "strategy/strategyRemove",
  async (data) => {
    const { strategies_Id } = data.values;
    const response = await axios.delete(
      `${apiUrl}/strategies/${strategies_Id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data?.token}`,
        },
      }
    );
    return response;
  }
);

export const strategyUpdateFilter = createAsyncThunk(
  "strategy/strategyFilter",
  async (data) => {
    const response = await axios.get(`${apiUrl}/strategies/${data.values}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.toke}`,
      },
    });
    return response;
  }
);

const strategySlice = createSlice({
  name: "strategy",
  initialState: {
    data: [],
    payloadHold: [],
    isAddedOrEdited: false,
    isLoading: false,
  },
  reducers: {
    addNewData: (state, action) => {
      state.payloadHold = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(strategyList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(strategyList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(strategyList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(strategyAdd.pending, (state, action) => {
        state.isLoading = true;
        // state.isAddedOrEdited = false;
      })
      .addCase(strategyAdd.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isAddedOrEdited = true;
        state.data = action?.payload?.data;
      })
      .addCase(strategyAdd.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(strategyEdit.pending, (state, action) => {
        state.isLoading = true;
        state.isAddedOrEdited = false;
      })
      .addCase(strategyEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
        // state.data = action?.payload?.data;
      })
      .addCase(strategyEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(strategyRemove.pending, (state, action) => {
        state.isLoading = true;
        // state.isAddedOrEdited = false;
      })
      .addCase(strategyRemove.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isAddedOrEdited = true;
      })
      .addCase(strategyRemove.rejected, (state, action) => {
        state.isLoading = false;
        // state.isAddedOrEdited = false;
      });
  },
});

export default strategySlice.reducer;
