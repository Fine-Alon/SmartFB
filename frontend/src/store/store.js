import { configureStore } from "@reduxjs/toolkit"

// Import the default exports (the reducers) from your slice files
import authReducer from "./slices/authSlice"
import feedbackSlice from "./slices/feedbackSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: feedbackSlice,
    ui: uiReducer,
  },
})
