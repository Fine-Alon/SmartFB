import React from "react"
import { Link } from "react-router-dom"

import queuePreview from "../assets/queue-preview.png"
import builderPreview from "../assets/builder-preview.png"

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* 1. Navigation ( header ) */}
      <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-600 tracking-tight">SmartFB</div>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          Log In
        </Link>
      </header>

      {/* main content */}
      <main className="flex flex-col items-center pt-12 pb-20 px-6">
        <div className="text-center max-w-4xl w-full mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 drop-shadow-sm tracking-tight">
            Welcome to SmartFB
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Streamline your feedback process and build powerful forms with our intelligent platform.
          </p>
        </div>

        {/* 3. functionality presentation */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* card 1: Feedback Queue */}
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-gray-50 rounded-xl overflow-hidden flex flex-col h-full border border-gray-100">
              <div className="px-6 py-4 bg-white border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Intelligent Feedback Queue</h3>
                <p className="text-sm text-gray-500">Review AI-processed submissions instantly.</p>
              </div>
              <div className="p-4 flex-1 flex items-start justify-center overflow-hidden">
                <img src={queuePreview} alt="Feedback Queue Preview" className="w-full object-cover rounded-lg shadow-sm" />
              </div>
            </div>
          </div>

          {/* card 2: Form Builder */}
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-gray-50 rounded-xl overflow-hidden flex flex-col h-full border border-gray-100">
              <div className="px-6 py-4 bg-white border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Dynamic Form Builder</h3>
                <p className="text-sm text-gray-500">Create custom surveys with an intuitive interface.</p>
              </div>
              <div className="p-4 flex-1 flex items-start justify-center overflow-hidden">
                <img src={builderPreview} alt="Form Builder Preview" className="w-full object-cover rounded-lg shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
