import React, { useState } from "react"
import { Link } from "react-router-dom"

import queuePreview from "../assets/queue-preview.png"
import builderPreview from "../assets/builder-preview.png"

const HomePage = () => {
  // --- States for Modal and Success Toast ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [contactData, setContactData] = useState({ name: "", email: "" })

  // --- Handlers ---
  const handleInputChange = e => {
    setContactData({ ...contactData, [e.target.name]: e.target.value })
  }

  const handleSend = e => {
    e.preventDefault()

    // Simulate sending data to backend
    console.log("Sending contact request:", contactData)

    // 1. Close Modal
    setIsModalOpen(false)
    // 2. Clear Form
    setContactData({ name: "", email: "" })
    // 3. Show Success Message
    setShowSuccess(true)

    // 4. Hide Success Message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center shrink-0">
        <div className="text-2xl font-extrabold text-blue-600 tracking-tight">SmartFB</div>
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 min-h-0">
        <div className="text-center max-w-3xl w-full mb-8 shrink-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 drop-shadow-sm tracking-tight">
            Welcome to SmartFB
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Streamline your feedback process and build powerful forms with our intelligent platform.
          </p>
        </div>

        {/* 3. Functionality presentation - добавлено min-h-0 для гибкости */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 mb-4">
          {/* Card 1: Feedback Queue */}
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100 flex flex-col h-full min-h-0 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-gray-50 rounded-xl flex flex-col h-full border border-gray-100 min-h-0">
              <div className="px-5 py-3 bg-white border-b border-gray-100 shrink-0">
                <h3 className="text-base font-bold text-gray-900">Intelligent Feedback Queue</h3>
                <p className="text-xs text-gray-500">Review AI-processed submissions instantly.</p>
              </div>
              <div className="p-3 flex-1 flex items-center justify-center min-h-0 overflow-hidden">
                <img
                  src={queuePreview}
                  alt="Feedback Queue Preview"
                  className="h-full w-full object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Form Builder */}
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100 flex flex-col h-full min-h-0 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-gray-50 rounded-xl flex flex-col h-full border border-gray-100 min-h-0">
              <div className="px-5 py-3 bg-white border-b border-gray-100 shrink-0">
                <h3 className="text-base font-bold text-gray-900">Dynamic Form Builder</h3>
                <p className="text-xs text-gray-500">Create custom surveys with an intuitive interface.</p>
              </div>
              <div className="p-3 flex-1 flex items-center justify-center min-h-0 overflow-hidden">
                <img
                  src={builderPreview}
                  alt="Form Builder Preview"
                  className="h-full w-full object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 shrink-0">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h4 className="text-lg font-bold text-gray-900 mb-1">Ready to upgrade your feedback process?</h4>
          <p className="text-sm text-gray-500 mb-3 max-w-md">
            Contact our team to request access and set up a custom workspace for your business.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Contact Sales
          </button>
        </div>
      </footer>

      {/* --- Pop-up Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Contact Us</h3>
            <p className="text-sm text-gray-500 mb-5">Leave your details and we will reach out shortly.</p>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={contactData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={contactData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@company.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Success Toast Notification --- */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-lg">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Request sent successfully! We'll be in touch.</span>
        </div>
      )}
    </div>
  )
}

export default HomePage
