import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [], // The array of feedback submissions
  isLoading: false,
  error: null,
}

const feedbackSlice = createSlice({
  name: "feedback", // Changed from 'tickets'
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setFeedback: (state, action) => {
      // Changed from setTickets
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    resolveFeedback: (state, action) => {
      // Changed from resolveTicket
      const feedbackId = action.payload
      const index = state.items.findIndex(f => f.id === feedbackId)
      if (index !== -1) {
        state.items[index].status = "resolved"
      }
    },
  },
})

export const { setLoading, setFeedback, setError, resolveFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer
