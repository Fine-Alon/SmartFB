import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/slices/authSlice"
import axiosClient from "../api/axiosClient"

const AdminProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector(state => state.auth)

  // Mock data for the UI - this will eventually come from your Redux store
  const adminData = {
    name: "Chaim",
    email: "chaim@smartfb.com",
    businessName: "SmartFB Solutions",
    role: "Super Admin",
  }

  // Local state for adding a new support member
  const [supportEmail, setSupportEmail] = useState("")
  const [supportPassword, setSupportPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleLogout = async () => {
    try {
      // 1. Call the backend API.
      await axiosClient.post("/api/auth/logout")
    } catch (error) {
      console.error("Logout request failed, but clearing local state anyway", error)
    } finally {
      // 2. Clear the Redux state (sets isAuthenticated to false)
      dispatch(logout())

      // 3. Redirect the user back to the login page
      navigate("/login")
    }
  }

  const handleAddSupport = async e => {
    e.preventDefault()

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    console.log("Registering support user:", {
      email: supportEmail,
      password: supportPassword,
    })

    try {
      // send POST to back
      const response = await axiosClient.post("/api/auth/register", {
        email: supportEmail,
        password: supportPassword,
      })

      console.log("Support user registered:", response.data)

      // clean up
      setSupportEmail("")
      setSupportPassword("")

      setSuccessMessage("Support member successfully registered!")

      // hide the message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Registration failed:", err)
      setError(err.response?.data?.detail || "Failed to register support user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-blue-600 font-bold">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{user?.name || "Unknown User"}</h2>
            <p className="text-sm text-gray-500 mb-4">{user?.role || "Admin"}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active Account
            </span>
          </div>
        </div>

        {/* Right Column: Details and Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Business Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Business Name</label>
                <div className="mt-1 text-gray-900">{user?.businessName || "SmartFB Solutions"}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                <div className="mt-1 text-gray-900">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Team Management / Add Support Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Team Management</h3>
            <p className="text-sm text-gray-500 mb-6">Register a new support team member to handle feedbacks.</p>

            <form onSubmit={handleAddSupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="support@smartfb.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={supportPassword}
                  onChange={e => setSupportPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* show error */}
              {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-100">{error}</div>}

              {/* show success */}
              {successMessage && (
                <div className="text-green-600 text-sm bg-green-50 p-2 rounded-md border border-green-100">{successMessage}</div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-medium py-2 px-4 rounded-md transition-colors text-sm text-white 
                    ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isLoading ? "Registering..." : "Register Support User"}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
            <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">Securely log out of your administrative session.</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfilePage
