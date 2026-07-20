import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchFeedbacks, setFilter, updateFeedbackStatus } from "../store/slices/queueSlice"
import QRCodeDisplay from "../components/common/QRCodeDisplay";

const FeedbackPage = () => {
  const dispatch = useDispatch()

  const { feedbacks, isLoading, error, activeFilter } = useSelector(state => state.queue)

  //  Manage opened modal window
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  useEffect(() => {
    dispatch(fetchFeedbacks())
  }, [dispatch])

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (activeFilter === "Requires Review") return feedback.status === "requires_human_review"
    if (activeFilter === "Auto-Resolved") return feedback.status === "auto_categorized"
    return true
  })

  const handleResolve = id => {
    dispatch(updateFeedbackStatus({ feedbackId: id, notes: "Resolved via dashboard" }))
    setSelectedFeedback(null) // Close model window.
  }

  // Loading in handler
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading feedbacks...</div>
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Queue</h1>
          <p className="text-gray-500 mt-1">Review AI-processed submissions and handle flagged feedbacks.</p>
        </div>

        {/* Filter Buttons */}
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          {["All", "Requires Review", "Auto-Resolved"].map(f => (
            <button
              key={f}
              // Switch filters by Redux dispatch
              onClick={() => dispatch(setFilter(f))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === f ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">ID & Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">AI Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFeedbacks.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{ticket.id}</div>
                    <div className="text-xs text-gray-400">{ticket.date}</div>
                  </td>
                  <td className="px-6 py-4">{ticket.customer}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {ticket.aiCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.status === "requires_human_review" ? (
                      <span className="inline-flex items-center text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                        Review Needed
                      </span>
                    ) : ticket.status === "resolved" ? (
                      <span className="inline-flex items-center text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium">
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        Auto-Categorized
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedFeedback(ticket)} className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFeedbacks.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No feedbacks found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ticket {selectedFeedback.id}</h2>
                <p className="text-sm text-gray-500">
                  From: {selectedFeedback.customer} ({selectedFeedback.contact})
                </p>
              </div>
              <button onClick={() => setSelectedFeedback(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* AI Analysis Block */}
              <div
                className={`p-4 rounded-lg border ${selectedFeedback.status === "requires_human_review" ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"}`}
              >
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  AI Analysis
                </h3>
                <p className="text-sm text-gray-800 mb-3">
                  <span className="font-semibold">Summary:</span> {selectedFeedback.aiSummary}
                </p>
                <div className="flex gap-3 text-xs">
                  <span className="bg-white px-2 py-1 rounded shadow-sm">
                    Category: <b>{selectedFeedback.aiCategory}</b>
                  </span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">
                    Sentiment: <b>{selectedFeedback.aiSentiment}</b>
                  </span>
                </div>
                {selectedFeedback.flagReason && (
                  <div className="mt-3 text-sm text-red-700 bg-red-100 px-3 py-2 rounded">
                    <b>Flagged Reason:</b> {selectedFeedback.flagReason}
                  </div>
                )}
              </div>

              {/* Raw Message Block */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Original Customer Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
                  {selectedFeedback.rawText}
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Survey QR Code</h3>
                {selectedFeedback.qr_code ? (
                  <QRCodeDisplay 
                    base64QrCode={selectedFeedback.qr_code} 
                    title="Customer Feedback QR" 
                  />
                ) : (
                  <p className="text-sm text-gray-400 italic">No QR code available for this feedback.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {selectedFeedback.status === "requires_human_review" && (
                <button
                  onClick={() => handleResolve(selectedFeedback.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackPage
