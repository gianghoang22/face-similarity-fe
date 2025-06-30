import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./app/page"
import "./app/global.css" // nếu bạn có style tailwind hoặc css chung

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
