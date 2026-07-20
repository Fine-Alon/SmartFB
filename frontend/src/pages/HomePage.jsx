import React from "react"
import { Link } from "react-router-dom"

import queuePreview from "../assets/queue-preview.png"
import builderPreview from "../assets/builder-preview.png"

const HomePage = () => {
  return (
    // h-screen и overflow-hidden строго фиксируют контент в пределах одного окна
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* 1. Navigation ( header ) - shrink-0 запрещает шапке сжиматься */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center shrink-0">
        <div className="text-2xl font-extrabold text-blue-600 tracking-tight">SmartFB</div>
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all"
        >
          Sign In
        </Link>
      </header>

      {/* 2. Main content - центрируем контент и разрешаем ему сжиматься (min-h-0) */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 min-h-0">
        {/* Уменьшены отступы текста */}
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
              {/* Картинка теперь подстраивается под высоту родителя */}
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
          <h4 className="text-lg font-bold text-gray-900 mb-1">Are you ready to Create Forms in easy way?</h4>
          <p className="text-sm text-gray-500 mb-3 max-w-md">
            Contact our team to access and set up a personal account for your business.{" "}
          </p>
          <a
            href="mailto:sales@smartfb.com"
            className="px-6 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Contact us
          </a>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
