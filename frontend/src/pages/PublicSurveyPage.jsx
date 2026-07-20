import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

const PublicSurveyPage = () => {
  const { formId } = useParams() // get ID from URL form (like: /survey/f8a9d2b1)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formConfig, setFormConfig] = useState(null) // form setting, that come from backend
  const [answers, setAnswers] = useState({}) // Guest answers

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // --- 1. Имитация GET-запроса (Загрузка формы) ---
  useEffect(() => {
    // В будущем здесь будет: axios.get(`/api/public/forms/${formId}`)
    const fetchForm = async () => {
      setIsLoading(true)
      try {
        // Имитируем задержку сети (1 секунда)
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Fake JSON ответ от FastAPI
        const mockBackendResponse = {
          id: formId,
          businessName: "CyberPro Cafe",
          title: "Оцените ваш визит",
          description: "Нам очень важно ваше мнение. Это займет меньше минуты.",
          fields: [
            { id: "q_rating", type: "rating", label: "Как вы оцените качество обслуживания?", required: true },
            {
              id: "q_comment",
              type: "textarea",
              label: "Что нам стоит улучшить?",
              placeholder: "Напишите ваши впечатления...",
              required: false,
            },
            {
              id: "q_email",
              type: "email",
              label: "Оставьте email, если хотите получить скидку (необязательно)",
              placeholder: "ваш@email.com",
              required: false,
            },
          ],
        }

        setFormConfig(mockBackendResponse)

        // Инициализируем пустые ответы на основе полей
        const initialAnswers = {}
        mockBackendResponse.fields.forEach(field => {
          initialAnswers[field.id] = field.type === "rating" ? 0 : ""
        })
        setAnswers(initialAnswers)
      } catch (err) {
        setError("The form is not found.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [formId])

  // --- Обработчики ввода ---
  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  // --- 2. Имитация POST-запроса (Отправка отзыва) ---
  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // validation: Checking if the necessary rating was submitted.
    if (answers["q_rating"] === 0) {
      alert("Please rate the service with stars.")
      setIsSubmitting(false)
      return
    }

    try {
      // get ready Payload for FastAPI
      const payload = {
        formId: formId,
        submittedAt: new Date().toISOString(),
        answers: answers,
      }
      console.log("Sending to backend POST /api/public/feedback:", payload)

      // imitate network latency
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In future here will be: await axios.post(`/api/public/feedback`, payload);

      setIsSubmitted(true) // Show thankful message
    } catch (err) {
      alert("An error occurred while submitting. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Error: the form was deleted
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <p className="text-xl text-gray-600">{error}</p>
      </div>
    )
  }

  // Thankful screen.
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank you!</h2>
        <p className="text-gray-500 max-w-sm">
          Your feedback has been submitted successfully. We value your opinion and are committed to improving based on your
          feedback.
        </p>
      </div>
    )
  }

  // form itself (Mobile-first)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-sm font-semibold tracking-wider uppercase opacity-80 mb-1">{formConfig.businessName}</h2>
          <h1 className="text-2xl font-bold">{formConfig.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <p className="text-gray-600 text-sm text-center -mt-2 mb-6">{formConfig.description}</p>

          {/* Dynamic rendering of fields (based on JSON from backend) */}
          {formConfig.fields.map(field => (
            <div key={field.id} className="space-y-3">
              <label className="block text-sm font-medium text-gray-800">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* type: rating (stars) */}
              {field.type === "rating" && (
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleAnswerChange(field.id, star)}
                      className="focus:outline-none transition-transform active:scale-90"
                    >
                      <svg
                        className={`w-12 h-12 ${answers[field.id] >= star ? "text-yellow-400" : "text-gray-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              {/* type: Textarea */}
              {field.type === "textarea" && (
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
                  placeholder={field.placeholder}
                  value={answers[field.id]}
                  onChange={e => handleAnswerChange(field.id, e.target.value)}
                  required={field.required}
                ></textarea>
              )}

              {/* type: Email */}
              {field.type === "email" && (
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  placeholder={field.placeholder}
                  value={answers[field.id]}
                  onChange={e => handleAnswerChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PublicSurveyPage
