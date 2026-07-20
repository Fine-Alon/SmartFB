import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../../api/axiosClient"
import { API_ENDPOINTS } from "../../api/apiConfig"

// 1. get feedbacks from the backend
export const fetchFeedbacks = createAsyncThunk("queue/fetchFeedbacks", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.REVIEWS.GET_ALL)
    return response // axiosClient interceptor returns response.data directly
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Failed to fetch feedbacks from server")
  }
})

// 2. async Thunk To change status of the feedback (f.e. resolved )
export const updateFeedbackStatus = createAsyncThunk(
  "queue/updateFeedbackStatus",
  async ({ feedbackId, notes }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(API_ENDPOINTS.REVIEWS.RESOLVE(feedbackId), {
        reviewer_notes: notes || "Resolved by staff",
      })
      return response // returns response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to update feedback status")
    }
  },
)

const initialState = {
  feedbacks: [
    {
      id: "TKT-001",
      date: "2026-07-20",
      customer: "John Doe",
    },
  ],
  activeFilter: "All", // ("All", "Requires Review", "Auto-Resolved")
  isLoading: false, // spinner indicator
  error: null, // error messages
}

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    // interface filtering tabs
    setFilter: (state, action) => {
      state.activeFilter = action.payload
    },
  },
  extraReducers: builder => {
    builder
      // --- processing fetchFeedbacks ---
      .addCase(fetchFeedbacks.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false
        state.feedbacks = action.payload
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // --- processing updateFeedbacksStatus ---
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const updateFeedbacks = action.payload
        // find a feedback in array and update its status on the fly,
        // To avoid another request of the whole list
        const index = state.feedbacks.findIndex(t => t.id === updateFeedbacks.id)
        if (index !== -1) {
          state.feedbacks[index] = updateFeedbacks
        }
      })
  },
})

export const { setFilter } = queueSlice.actions
export default queueSlice.reducer
