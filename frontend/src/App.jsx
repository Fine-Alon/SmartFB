import React from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import FeedbackPage from "./pages/FeedbackPage"
import FormBuilderPage from "./pages/FormBuilderPage"
import AdminProfilePage from "./pages/AdminProfilePage"
import ProtectedRoute from "./components/common/ProtectedRoute"

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
    element: <ProtectedRoute allowedRoles={["admin", "support"]} />,
    children: [
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
