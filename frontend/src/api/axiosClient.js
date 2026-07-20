import axios from 'axios';

// Create an Axios instance
// Uses Vite's environment variable, or defaults to standard FastAPI local port
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------
// Request Interceptor
// Automatically attaches the JWT token to the headers of every request
// ----------------------------------------------------------------
axiosClient.interceptors.request.use(
  (config) => {
    // Grab the token from localStorage (set during login)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------
// Response Interceptor
// Globally handles responses and common errors
// ----------------------------------------------------------------
axiosClient.interceptors.response.use(
  (response) => {
    // Return the response data directly to keep component code clean
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Handle 401 Unauthorized (Token expired or missing)
      if (response.status === 401) {
        console.error('Unauthorized access - redirecting to login');
        
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        
        // Uncomment this line when auth is fully implemented:
        // window.location.href = '/login';
      }
      
      // Handle 403 Forbidden (User doesn't have admin permissions)
      if (response.status === 403) {
        console.error('Forbidden - you do not have permission to perform this action');
      }
    } else {
      console.error('Network Error - Is the FastAPI server running?');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;