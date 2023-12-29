import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const sessionList = createAsyncThunk(
  "session/sessionList",
  async (token) => {
    const response = await axios.get(`${apiUrl}/sessions`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
);

export const sessionAdd = createAsyncThunk(
  "session/sessionAdd",
  async (data) => {
    const dataToSend={
        session_startDate:data.session_startDate,
        session_endDate:data.session_endDate,
        session_category:data.session_category,
        session_rating:data.session_rating,
        session_lessonsLearned:data.session_lessonsLearned,
      }
    const response = await axios.post(`${apiUrl}/sessions`, dataToSend, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data?.token}`,
      },
    });
    return response;
  }
);

export const sessionEdit = createAsyncThunk(
  "session/sessionEdit",
  async (data) => {
    const { sessions_Id } = data.values;
    delete data.values.sessions_Id;
    const response = await axios.put(
      `${apiUrl}/sessions/update/${sessions_Id}`,
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

export const sessionRemove = createAsyncThunk(
  "session/sessionRemove",
  async (data) => {
    const { sessions_Id } = data.values;
    const response = await axios.delete(
      `${apiUrl}/sessions/${sessions_Id}`,
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

export const sessionUpdateFilter = createAsyncThunk(
  "session/sessionFilter",
  async (data) => {
    const response = await axios.get(`${apiUrl}/sessions/${data.values}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.toke}`,
      },
    });
    return response;
  }
);

const sessionSlice = createSlice({
  name: "session",
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
      .addCase(sessionList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(sessionList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(sessionList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(sessionAdd.pending, (state, action) => {
        state.isLoading = true;
        state.isAddedOrEdited = false;
      })
      .addCase(sessionAdd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
        state.data = action?.payload?.data;
      })
      .addCase(sessionAdd.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(sessionEdit.pending, (state, action) => {
        state.isLoading = true;
        state.isAddedOrEdited = false;
      })
      .addCase(sessionEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
        // state.data = action?.payload?.data;
      })
      .addCase(sessionEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(sessionRemove.pending, (state, action) => {
        state.isLoading = true;
        // state.isAddedOrEdited = false;
      })
      .addCase(sessionRemove.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isAddedOrEdited = true;
      })
      .addCase(sessionRemove.rejected, (state, action) => {
        state.isLoading = false;
        // state.isAddedOrEdited = false;
      });
  },
});

export default sessionSlice.reducer;
