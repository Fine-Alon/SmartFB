import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../../api/axiosClient"

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    // refresh JSON obj (username, password)
    const response = await axiosClient.post("/api/auth/login", credentials)
    return response.data // returns user data (id, username)
  } catch (error) {
    return rejectWithValue(error.response?.data || "authorization error")
  }
})

// TODO: убрать мок перед деплоем ВРЕМЕННЫЙ МОК ДЛЯ РАЗРАБОТКИ (Убрать, когда будет готов бэкенд!)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      id: 1,
      username: "Chaim",
      email: "chaim@smartfb.com",
      role: "admin", // "support"
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
