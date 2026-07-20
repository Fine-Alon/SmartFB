import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar" // You'll build this next

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          {/* This is where the specific page components get rendered */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
