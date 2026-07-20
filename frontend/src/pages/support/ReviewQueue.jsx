import React, { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Search, Loader2 } from "lucide-react"
import ReviewCard from "./ReviewCard"
import axiosClient from "../../api/axiosClient"
import { API_ENDPOINTS } from "../../api/apiConfig"

const ReviewQueue = () => {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)

  const fetchQueue = async () => {
    setIsLoading(true)
    try {
      const data = await axiosClient.get(API_ENDPOINTS.REVIEWS.GET_QUEUE)
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch queue:", error)
      setNotification("Failed to load the review queue.")
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const handleResolve = async (id, notes) => {
    setIsSubmitting(true)
    try {
      await axiosClient.patch(API_ENDPOINTS.REVIEWS.RESOLVE(id), { reviewer_notes: notes })
      
      setReviews(prev => prev.filter(r => r.id !== id))
      setNotification("Review resolved successfully.")
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Resolution failed:", error)
      setNotification("Failed to resolve the review. Please try again.")
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-[calc(100vh-80px)]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Urgent Review Queue</h1>
            {!isLoading && (
              <span className="bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-xs border border-red-200">
                {reviews.length} Action Required
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Review and resolve AI-flagged customer feedback.</p>
        </div>

        {/* Mock Search/Filter area */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Loading Overlay for submission */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Loader2 className="w-6 h-6 text-slate-800 animate-spin" />
            </div>
          </div>
        )}

        {isLoading ? (
          // Skeleton Loader
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4 animate-pulse">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 mt-1"></div>
                <div className="flex-grow space-y-3">
                  <div className="flex gap-2">
                    <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
                    <div className="w-24 h-5 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="w-24 h-9 bg-slate-200 rounded-lg mt-4 md:mt-0"></div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">You're all caught up!</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              There are no pending urgent reviews in the queue at this time. Great job!
            </p>
          </div>
        ) : (
          // Review List
          <div className="space-y-5">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} onResolve={handleResolve} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewQueue
