import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDashboardStats } from "../store/slices/dashboardSlice"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { stats, isLoading, error } = useSelector(state => state.dashboard)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  // Map category distribution names to match chart colors
  const categoryColors = {
    SAFE: "#10b981",         // Emerald
    NEEDS_REVIEW: "#f59e0b", // Amber
    URGENT: "#f43f5e",       // Rose
    UNKNOWN: "#6b7280"       // Gray
  }

  const pieData = stats.ai_category_distribution.map(item => ({
    name: item.category,
    value: item.count,
    color: categoryColors[item.category] || categoryColors.UNKNOWN
  }))

  const barData = stats.submissions_over_time

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username || "User"}! 👋</h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your customer feedback today.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading metrics...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_submissions}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-1">Active Forms</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active_forms}</p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-green-800">🟢 AI Auto-Resolved</p>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.auto_categorized}</p>
              <p className="text-xs text-green-700 mt-1">Standard feedback handled safely</p>
            </div>

            <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-red-800">🔴 Requires Human Review</p>
              </div>
              <p className="text-3xl font-bold text-red-900">{stats.pending_review}</p>
              <p className="text-xs text-red-700 mt-1">Threats or extreme content flagged</p>
            </div>
          </div>

          {/* Charts Section */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie Chart: Category Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
              <h3 className="text-md font-bold text-gray-700 mb-4">AI Category Breakdown</h3>
              {pieData.length > 0 ? (
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No categorical data available
                </div>
              )}
            </div>

            {/* Bar Chart: Submissions Over Time */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
              <h3 className="text-md font-bold text-gray-700 mb-4">Submissions Over Time</h3>
              {barData.length > 0 ? (
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{fontSize: 12}} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No submission timeline data available
                </div>
              )}
            </div>
            
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
