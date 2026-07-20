import React from "react"
import { Link } from "react-router-dom"

const DashboardPage = () => {
  // Mock data for hackathon visualization
  const metrics = {
    totalSubmissions: 142,
    autoCategorized: 118,
    pendingReview: 24,
    activeForms: 3,
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin! 👋</h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your customer feedback today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Submissions</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalSubmissions}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Active Forms</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.activeForms}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-green-800">🟢 AI Auto-Resolved</p>
          </div>
          <p className="text-3xl font-bold text-green-900">{metrics.autoCategorized}</p>
          <p className="text-xs text-green-700 mt-1">Standard feedback handled safely</p>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-red-800">🔴 Requires Human Review</p>
          </div>
          <p className="text-3xl font-bold text-red-900">{metrics.pendingReview}</p>
          <p className="text-xs text-red-700 mt-1">Threats or extreme content flagged</p>
        </div>
      </div>

      {/* Quick Actions Hub */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action: Form Builder */}
        <Link
          to="/form-builder"
          className="group block bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Create New Form</h3>
          <p className="text-gray-500 text-sm">
            Build dynamic questionnaires, customize fields, and generate shareable links and QR codes.
          </p>
        </Link>

        {/* Action: Feedback Queue */}
        <Link
          to="/feedbacks"
          className="group block bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-red-500 hover:shadow-md transition-all"
        >
          <div className="h-12 w-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Review Pending Feedbacks</h3>
          <p className="text-gray-500 text-sm">
            Check the AI triage queue for urgent issues, threats, and feedback that requires your immediate attention.
          </p>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
