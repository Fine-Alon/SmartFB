import React from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"
import SupportLayout from "./components/layout/SupportLayout"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import FeedbackPage from "./pages/FeedbackPage"
import FormBuilderPage from "./pages/FormBuilderPage"
import AdminProfilePage from "./pages/AdminProfilePage"
import SupportDashboard from "./pages/support/SupportDashboard"
import ReviewQueue from "./pages/support/ReviewQueue"
import ProtectedRoute from "./components/common/ProtectedRoute"
import PublicSurveyPage from "./pages/PublicSurveyPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/survey/:formId",
    element: <PublicSurveyPage />,
  },
  {
    element: <ProtectedRoute allowedRoles={["admin", "support"]} />,
    children: [
      // Admin Layout wrapping common & admin-specific pages
      {
        element: <MainLayout />,
        children: [
          // common
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/feedbacks", element: <FeedbackPage /> },

          // admin only
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              { path: "/profile", element: <AdminProfilePage /> },
              { path: "/form-builder", element: <FormBuilderPage /> },
            ],
          },
        ],
      },
      // Support Layout wrapping support-specific pages
      {
        element: <SupportLayout />,
        children: [
          {
            element: <ProtectedRoute allowedRoles={["support", "admin"]} />,
            children: [
              { path: "/support/dashboard", element: <SupportDashboard /> },
              { path: "/support/queue", element: <ReviewQueue /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

