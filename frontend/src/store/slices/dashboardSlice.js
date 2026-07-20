import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../../api/axiosClient"

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/analytics/global-stats")
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch dashboard stats")
    }
  }
)

const initialState = {
  stats: {
    total_submissions: 0,
    auto_categorized: 0,
    pending_review: 0,
    active_forms: 0,
    ai_category_distribution: [],
    submissions_over_time: []
  },
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
