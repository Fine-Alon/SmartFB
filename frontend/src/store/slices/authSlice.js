import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../../api/axiosClient"
import { API_ENDPOINTS } from "../../api/apiConfig"

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    // תוקן: שימוש בהערה נכונה של JS ומחזירים את התשובה הנקייה
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || error.message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      id: 1,
      username: "Chaim",
      email: "chaim@smartfb.com",
      role: "admin",
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: state => {
      state.user = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer