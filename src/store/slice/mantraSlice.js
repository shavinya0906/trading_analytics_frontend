import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const mantraList = createAsyncThunk(
  "mantra/mantraList",
  async (token) => {
    const response = await axios.get(`${apiUrl}/mantras`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
);

export const mantraAdd = createAsyncThunk("mantra/mantraAdd", async (data) => {
  const response = await axios.post(`${apiUrl}/mantras`, data?.values, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${data?.token}`,
    },
  });
  return response;
});

export const mantraEdit = createAsyncThunk(
  "mantra/mantraEdit",
  async (data) => {
    const { mantras_Id } = data.values;
    delete data.values.mantras_Id;
    const response = await axios.put(
      `${apiUrl}/mantras/update/${mantras_Id}`,
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

export const mantraRemove = createAsyncThunk(
  "mantra/mantraRemove",
  async (data) => {
    const { mantras_Id } = data.values;
    try {
      await axios.delete(`${apiUrl}/mantras/${mantras_Id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data?.token}`,
        },
      });

      return { deletedMantraId: mantras_Id };
    } catch (error) {
      throw error;
    }
  }
);

export const mantraUpdateFilter = createAsyncThunk(
  "mantra/mantraFilter",
  async (data) => {
    const response = await axios.get(`${apiUrl}/mantras/${data.values}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.toke}`,
      },
    });
    return response;
  }
);

const MantraSlice = createSlice({
  name: "mantra",
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
      .addCase(mantraList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(mantraList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(mantraList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(mantraAdd.pending, (state, action) => {
        state.isLoading = true;
        // state.isAddedOrEdited = false;
      })
      .addCase(mantraAdd.fulfilled, (state, action) => {
        state.isLoading = false;
        const addedMantra = action?.payload?.data;
        state.data = [...state.data, addedMantra];
        state.isAddedOrEdited = true;
      })
      .addCase(mantraAdd.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(mantraEdit.pending, (state, action) => {
        state.isLoading = true;
        state.isAddedOrEdited = false;
      })
      .addCase(mantraEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
      })
      .addCase(mantraEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(mantraRemove.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(mantraRemove.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoading = false;
        const deletedMantraId = action?.payload?.deletedMantraId;
        console.log(deletedMantraId);
        state.data = state.data.filter(
          (mantra) => mantra.id !== deletedMantraId
        );
        state.isAddedOrEdited = true;
      })
      .addCase(mantraRemove.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default MantraSlice.reducer;
