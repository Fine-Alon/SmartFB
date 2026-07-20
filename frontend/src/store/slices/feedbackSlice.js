import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../../api/axiosClient"
import { API_ENDPOINTS } from "../../api/apiConfig"

export const submitEssay = createAsyncThunk("feedback/submitEssay", async (essayText, { rejectWithValue }) => {
  try {
    // send the object with the field - essay_text (or answers dict mapped to endpoint)
    const response = await axiosClient.post(API_ENDPOINTS.SUBMISSIONS.SUBMIT("default_form"), {
      answers: { feedback: essayText },
    })
    return response // axiosClient returns response directly
  } catch (error) {
    return rejectWithValue(error.response?.data || "feedback analyze error")
  }
})

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    analysisResult: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearFeedback: state => {
      state.analysisResult = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitEssay.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitEssay.fulfilled, (state, action) => {
        state.isLoading = false
        state.analysisResult = action.payload
      })
      .addCase(submitEssay.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer
