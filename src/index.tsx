import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ModalProvider } from "./component/modal"
import { StoreProvider } from "./component/store"

// Prevent browser-level pinch zoom (iOS Safari ignores viewport user-scalable=no)
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length >= 2) {
      e.preventDefault()
    }
  },
  { passive: false },
)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <ModalProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ModalProvider>
  </React.StrictMode>,
)
