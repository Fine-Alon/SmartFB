import React, { useState } from "react"
import { AlertCircle, ChevronDown, ChevronUp, Flag } from "lucide-react"

const ReviewCard = ({ review, onResolve }) => {
  const [expanded, setExpanded] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [notes, setNotes] = useState("")

  const { id, ai_analysis, original_answers, created_at } = review

  // Visuals based on sentiment
  const isCritical = ai_analysis.sentiment_score <= 2
  const badgeColor = isCritical ? "bg-red-100 text-red-700 border-red-200" : "bg-orange-100 text-orange-700 border-orange-200"
  const iconColor = isCritical ? "text-red-500" : "text-orange-500"

  const handleResolve = () => {
    setIsResolving(!isResolving)
    if (isResolving) {
      // If closing, clear notes
      setNotes("")
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    onResolve(id, notes)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col md:flex-row md:items-start gap-4">
        {/* Severity Icon */}
        <div className={`mt-1 flex-shrink-0 ${iconColor}`}>
          {isCritical ? <AlertCircle className="w-6 h-6" /> : <Flag className="w-6 h-6" />}
        </div>

        {/* Core Info */}
        <div className="flex-grow space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
              Score: {ai_analysis.sentiment_score}/5
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {ai_analysis.category}
            </span>
            <span className="text-xs text-slate-400 ml-auto">{new Date(created_at).toLocaleString()}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-800">{ai_analysis.summary}</h3>

          <p className="text-sm font-medium text-slate-600">
            Flagged for: <span className="text-slate-800">{ai_analysis.flag_reason}</span>
          </p>

          {/* Expandable Original Text */}
          <div className="pt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              {expanded ? "Hide original feedback" : "View original feedback"}
            </button>

            {expanded && (
              <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 font-serif leading-relaxed animate-in slide-in-from-top-2 duration-200">
                "{original_answers.feedback}"
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 mt-4 md:mt-0">
          <button
            onClick={handleResolve}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isResolving
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow"
            }`}
          >
            {isResolving ? "Cancel" : "Resolve Issue"}
          </button>
        </div>
      </div>

      {/* Resolution Form (Inline) */}
      {isResolving && (
        <div className="bg-slate-50 border-t border-slate-200 p-5 animate-in fade-in duration-200">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Resolution Notes</label>
            <textarea
              required
              rows="3"
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3 mb-4 resize-none"
              placeholder="Detail the actions taken to resolve this feedback..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm hover:shadow"
              >
                Submit Resolution
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ReviewCard
