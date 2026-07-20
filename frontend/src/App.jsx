import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"

// Page Imports (Placeholders for now)
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import FormBuilderPage from "./pages/FormBuilderPage"
import FeedbackPage from "./pages/FeedbackPage"
import AdminProfilePage from "./pages/AdminProfilePage"

function App() {
  // Placeholder for Redux auth state
  const isAuthenticated = true

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Routes (Wrapped in MainLayout) */}
        <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="form-builder" element={<FormBuilderPage />} />
          <Route path="tickets" element={<FeedbackPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        {/* Catch-all for 404s */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
