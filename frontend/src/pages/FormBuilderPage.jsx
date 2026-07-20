import React, { useState } from "react"
import axiosClient from "../api/axiosClient"

const FormBuilderPage = () => {
  const [formTitle, setFormTitle] = useState("Customer Feedback Survey")
  const [formDescription, setFormDescription] = useState("We value your opinion. Please let us know how we did!")

  // Array holding all the questions for the current form
  const [fields, setFields] = useState([])

  // Publish state
  const [isPublished, setIsPublished] = useState(false)
  const [publishedLink, setPublishedLink] = useState("")
  const [error, setError] = useState("")

  // --- Actions ---

  const addField = type => {
    const newField = {
      id: `field_${Date.now()}`,
      type: type,
      label:
        type === "text" ? "New Text Question" : type === "rating" ? "Rate your experience (1-5)" : "Multiple Choice Question",
      options: type === "multiple_choice" ? ["Option 1", "Option 2"] : [],
      required: false,
    }
    setFields([...fields, newField])
  }

  const removeField = id => {
    setFields(fields.filter(field => field.id !== id))
  }

  const updateField = (id, key, value) => {
    setFields(fields.map(field => (field.id === id ? { ...field, [key]: value } : field)))
  }

  const updateOption = (fieldId, optionIndex, value) => {
    setFields(
      fields.map(field => {
        if (field.id === fieldId) {
          const newOptions = [...field.options]
          newOptions[optionIndex] = value
          return { ...field, options: newOptions }
        }
        return field
      }),
    )
  }

  const addOption = fieldId => {
    setFields(
      fields.map(field => {
        if (field.id === fieldId) {
          return { ...field, options: [...field.options, `Option ${field.options.length + 1}`] }
        }
        return field
      }),
    )
  }

  const handlePublish = async () => {
    setError("")
    // Construct the payload matching the backend SurveyCreate schema
    const formSchema = {
      title: formTitle,
      description: formDescription,
      questions: fields.map(field => ({
        question_id: field.id,
        label: field.label,
        type: field.type === "text" ? "open_answer" : field.type,
        is_required: field.required,
        options: field.type === "multiple_choice" ? field.options : null
      }))
    }

    try {
      const response = await axiosClient.post("/surveys/", formSchema)
      const formId = response.id || response._id
      
      // Update link with the actual ObjectId from MongoDB
      setPublishedLink(`${window.location.origin}/survey/${formId}`)
      setIsPublished(true)
    } catch (err) {
      console.error("Publishing failed:", err)
      setError(err.response?.data?.detail || "Failed to publish form. Make sure you are logged in as admin.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-500 mt-1">Create a dynamic feedback form to share with your customers.</p>
        </div>
        {!isPublished && (
          <button
            onClick={handlePublish}
            disabled={fields.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            Save & Publish Form
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Main Builder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: The Form Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <input
              type="text"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 w-full outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors mb-2"
              placeholder="Form Title"
            />
            <input
              type="text"
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              className="text-gray-500 w-full outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors"
              placeholder="Form Description"
            />
          </div>

          {/* Form Fields Mapping */}
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group">
              {/* Delete Button (appears on hover) */}
              <button
                onClick={() => removeField(field.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Question"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2 mb-4 pr-8">
                <span className="bg-gray-100 text-gray-500 font-medium px-2 py-1 rounded text-xs">Q{index + 1}</span>
                <input
                  type="text"
                  value={field.label}
                  onChange={e => updateField(field.id, "label", e.target.value)}
                  className="font-medium text-gray-900 w-full outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Render Field Preview based on Type */}
              <div className="pl-9">
                {field.type === "text" && (
                  <textarea
                    disabled
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-400 resize-none"
                    rows="2"
                    placeholder="Customer will type their answer here..."
                  />
                )}

                {field.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <div
                        key={num}
                        className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "multiple_choice" && (
                  <div className="space-y-2">
                    {field.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                        <input
                          type="text"
                          value={opt}
                          onChange={e => updateOption(field.id, optIdx, e.target.value)}
                          className="text-sm outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors flex-1"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(field.id)}
                      className="text-xs text-blue-600 font-medium mt-2 hover:underline"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-500">Your form is empty. Add a question from the menu to get started.</p>
            </div>
          )}
        </div>

        {/* Right Column: Controls & Publish Modal */}
        <div className="space-y-6">
          {/* Add Field Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add Question</h3>
            <div className="space-y-3">
              <button
                onClick={() => addField("text")}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="bg-gray-100 p-2 rounded group-hover:bg-blue-100 group-hover:text-blue-600 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Text Response</span>
              </button>

              <button
                onClick={() => addField("rating")}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="bg-gray-100 p-2 rounded group-hover:bg-blue-100 group-hover:text-blue-600 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">1-5 Rating</span>
              </button>

              <button
                onClick={() => addField("multiple_choice")}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="bg-gray-100 p-2 rounded group-hover:bg-blue-100 group-hover:text-blue-600 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Multiple Choice</span>
              </button>
            </div>
          </div>

          {/* Post-Publish Panel (Appears after clicking Save) */}
          {isPublished && (
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200 animate-fade-in-up">
              <h3 className="font-bold text-green-800 mb-2">🎉 Form Published!</h3>
              <p className="text-sm text-green-700 mb-4">Your form is live and ready to collect feedback.</p>

              <label className="block text-xs font-semibold text-green-900 mb-1">Shareable Link:</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={publishedLink}
                  className="w-full text-xs bg-white border border-green-300 rounded p-2 text-gray-600 focus:outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(publishedLink)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium"
                >
                  Copy
                </button>
              </div>

              <div className="text-center bg-white p-4 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-gray-500 mb-2">QR Code</p>
                <div className="w-32 h-32 mx-auto flex items-center justify-center border-4 border-white shadow-sm rounded overflow-hidden">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(publishedLink)}`} 
                    alt="Survey QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormBuilderPage
