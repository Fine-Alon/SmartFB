import { configureStore } from "@reduxjs/toolkit"

// Import the default exports (the reducers) from your slice files
import authReducer from "./slices/authSlice"
import feedbackSlice from "./slices/feedbackSlice"
import uiReducer from "./slices/uiSlice"
import queueReducer from "./slices/queueSlice"
import dashboardReducer from "./slices/dashboardSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feedbacks: feedbackSlice,
    queue: queueReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
  },
})
