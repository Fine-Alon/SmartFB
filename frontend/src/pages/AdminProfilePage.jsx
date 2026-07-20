import React, { useState } from "react"
// import { useDispatch } from 'react-redux';
// import { logout } from '../../store/slices/authSlice';

const AdminProfilePage = () => {
  // const dispatch = useDispatch();

  // Mock data for the UI - this will eventually come from your Redux store
  const adminData = {
    name: "Chaim",
    email: "chaim@smartfb.com",
    businessName: "SmartFB Solutions",
    role: "Super Admin",
  }

  // Local state for UI toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleLogout = () => {
    // dispatch(logout());
    console.log("Logging out...")
    // window.location.href = '/login';
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
              <span className="text-3xl text-blue-600 font-bold">{adminData.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{adminData.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{adminData.role}</p>
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
                <div className="mt-1 text-gray-900">{adminData.businessName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                <div className="mt-1 text-gray-900">{adminData.email}</div>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">System Preferences</h3>
            <div className="space-y-4">
              {/* Toggle: Email Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Alerts</h4>
                  <p className="text-sm text-gray-500">Receive notifications for high-risk tickets.</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`${emailAlerts ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${emailAlerts ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>

              {/* Toggle: Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-500">Toggle dark theme for the dashboard.</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`${darkMode ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${darkMode ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
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
