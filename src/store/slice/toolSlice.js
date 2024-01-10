import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const uploadPreviousTradebookFile = createAsyncThunk(
  "previous-tradebook/upload",
  async (data) => {
    console.log(data.file);
    const formData = new FormData();
    formData.append("file", data.file);
    try {
      const response = await axios.post(`${apiUrl}/tradebook/upload`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${data.token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  }
);

//extract already uploaded tradebook-file
export const getUploadedTradebookFile = createAsyncThunk(
  "previous-tradebook/get",
  async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/tradebook/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error getting file:", error.message);
    }
  }
);

const toolSlice = createSlice({
  name: "tools",
  initialState: {
    data: [],
    isAddedOrEdited: false,
    isLoading: true,
    currentTab: "Sessions",
  },
  reducers: {
    loadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    addCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    updateTradebookData: (state, action) => {
      state.data = action.payload;
      state.isAddedOrEdited = true; // You may want to set this flag based on your requirements
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPreviousTradebookFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadPreviousTradebookFile.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(uploadPreviousTradebookFile.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(getUploadedTradebookFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUploadedTradebookFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(getUploadedTradebookFile.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});
export const { loadingStatus, addCurrentTab,updateTradebookData } = toolSlice.actions;
export default toolSlice.reducer;
