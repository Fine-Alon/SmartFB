import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  // CRITICAL: This tells the browser to include the secure cookie in every request
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Response Interceptor - this for handling global errors like expiration
axiosClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { response } = error
    if (response) {
      if (response.status === 401) {
        console.error("Unauthorized access - session expired")
        // redirect to /login
        // 1. Clear the frontend Redux state
        store.dispatch(logout())

        // 2. Force the browser to redirect to the login page
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient
