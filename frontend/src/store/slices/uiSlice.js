import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  darkMode: false,
  emailAlerts: true,
  sidebarOpen: false, // Useful if you make the sidebar collapsible on mobile
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: state => {
      state.darkMode = !state.darkMode
    },
    toggleEmailAlerts: state => {
      state.emailAlerts = !state.emailAlerts
    },
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

export const { toggleDarkMode, toggleEmailAlerts, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
