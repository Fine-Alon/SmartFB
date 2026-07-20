import React, { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { LayoutDashboard, AlertTriangle, LogOut, Menu, X, User } from "lucide-react"
import { logout } from "../../store/slices/authSlice"
import axiosClient from "../../api/axiosClient"

const SupportLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Extract support user details from Redux state
  const user = useSelector((state) => state.auth?.user) || { email: "support@smartfb.com", name: "Support Agent" }

  const handleLogout = async () => {
    try {
      await axiosClient.post("/api/auth/logout")
    } catch (error) {
      console.error("Logout request failed, but clearing local state anyway", error)
    } finally {
      dispatch(logout())
      navigate("/login")
    }
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/support/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Urgent Review Queue",
      path: "/support/queue",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ]

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between w-full h-16 px-6 bg-slate-900 text-white border-b border-slate-800 fixed top-0 left-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            SmartFB
          </span>
          <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
            Support
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 w-72 h-full bg-slate-900 text-slate-100 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Branding & Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SmartFB
            </span>
            <span className="text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              Support
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            Navigation
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-l-4 border-blue-500 text-blue-400 bg-slate-800/40"
                    : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-100 border-l-4 border-transparent"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile / Footer Area */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/20">
          <div className="flex flex-col gap-4 px-2 py-3">
            {/* User Profile Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-blue-400 shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {user.name || "Support Agent"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-400 border border-slate-700/50 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto mt-16 md:mt-0 p-6 md:p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SupportLayout
