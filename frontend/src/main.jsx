import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

// We import the Redux store (you will need to create this file next)
import { store } from "./store/store"

import App from "./App"
import "./index.css" // This must be imported to apply Tailwind classes

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
