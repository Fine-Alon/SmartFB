import React, { useState } from "react"
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../store/slices/authSlice';

const AuthPage = () => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // Toggle between Login and Sign Up
  const [isLogin, setIsLogin] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
  })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Hackathon mockup: Simulate a successful login/signup
    console.log(`${isLogin ? "Logging in" : "Signing up"} with:`, formData)

    // TODO: Connect to backend auth API here using Axios

    // Simulate Redux auth success and redirect to dashboard
    // dispatch(loginSuccess({ user: formData.email, token: 'mock-token' }));
    // navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">SmartFB</h2>
          <h3 className="text-xl font-semibold text-gray-900">{isLogin ? "Log in to your account" : "Create a new account"}</h3>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? "Welcome back! Please enter your details." : "Start managing customer feedback smarter."}
          </p>
        </div>

        {/* Auth Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Show Business Name only on Sign Up */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessName">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required={!isLogin}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="SmartFB Solutions"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle State Button */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                // Reset form when toggling
                setFormData({ businessName: "", email: "", password: "" })
              }}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
