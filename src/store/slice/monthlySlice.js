import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const monthlyQuestionnaireList = createAsyncThunk(
  "monthlyQuestionnaire/monthlyQuestionnaireList",
  async (token) => {
    const response = await axios.get(`${apiUrl}/monthly-questionnaire`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
);

export const monthlyQuestionnaireAdd = createAsyncThunk(
  "monthly-questionnaire",
  async (data) => {
    const response = await axios.post(
      `${apiUrl}/monthly-questionnaire`,
      data?.values,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }
    );
    return response;
  }
);

export const monthlyQuestionnaireEdit = createAsyncThunk(
  "monthlyQuestionnaire/monthlyQuestionnaireEdit",
  async (data) => {
    const { id } = data.values;
    delete data.values.id;

    const response = await axios.put(
      `${apiUrl}/monthly-questionnaire/update/${id}`,
      data?.values,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }
    );
    return response;
  }
);

export const monthlyQuestionnaireRemove = createAsyncThunk(
  "monthlyQuestionnaire/monthlyQuestionnaireRemove",
  async (data) => {
    const { id } = data.values; 
    try {
      await axios.delete(
        `${apiUrl}/monthly-questionnaire/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.token}`,
          },
        }
      );

      return { deletedQuestionnaireId: id };
    } catch (error) {
      throw error;
    }
  }
);

const MonthlyQuestionnaireSlice = createSlice({
  name: "monthlyQuestionnaire",
  initialState: {
    data: [],
    updatedQuestionnaire:{},
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
      .addCase(monthlyQuestionnaireList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(monthlyQuestionnaireList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
      })
      .addCase(monthlyQuestionnaireList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(monthlyQuestionnaireAdd.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(monthlyQuestionnaireAdd.fulfilled, (state, action) => {
        state.isLoading = false;
        const addedQuestionnaire = action?.payload?.data;
        state.data = [...state.data, addedQuestionnaire];
        state.isAddedOrEdited = true;
      })
      .addCase(monthlyQuestionnaireAdd.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = false;
      })
      .addCase(monthlyQuestionnaireEdit.pending, (state, action) => {
        state.isLoading = true;
        state.isAddedOrEdited = false;
      })
      .addCase(monthlyQuestionnaireEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
        state.updatedQuestionnaire = action?.payload?.data; // Assuming your API returns the updated questionnaire object
        state.data = state.data.map((questionnaire) =>
          questionnaire.id === state.updatedQuestionnaire.id
            ? state.updatedQuestionnaire
            : questionnaire
        );
      })
      .addCase(monthlyQuestionnaireEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.isAddedOrEdited = true;
      })
      .addCase(monthlyQuestionnaireRemove.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(monthlyQuestionnaireRemove.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoading = false;
        const deletedQuestionnaireId = action?.payload?.deletedQuestionnaireId;
        console.log(deletedQuestionnaireId);
        state.data = state.data.filter(
          (questionnaire) => questionnaire.id !== deletedQuestionnaireId
        );
        state.isAddedOrEdited = true;
      })
      .addCase(monthlyQuestionnaireRemove.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default MonthlyQuestionnaireSlice.reducer;
