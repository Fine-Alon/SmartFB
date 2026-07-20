import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../../api/axiosClient"

export const submitEssay = createAsyncThunk("feedback/submitEssay", async (essayText, { rejectWithValue }) => {
  try {
    // send the object with the field - essay_text
    const response = await axiosClient.post("/api/essays/analyze", {
      essay_text: essayText,
    })
    return response.data // get results from the backend
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
