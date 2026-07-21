import axios from "axios"
import { store } from "../store/store"
import { logout } from "../store/slices/authSlice"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
})

// Response Interceptor
axiosClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { response } = error
    if (response) {
      if (response.status === 401) {
        console.error("Unauthorized access - session expired")
        // Теперь store существует, и редирект сработает корректно!
        store.dispatch(logout())
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient
