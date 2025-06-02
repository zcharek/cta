import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { motion, LazyMotion, domAnimation } from "framer-motion";

// Make framer-motion available globally
// Add motion to window type
declare global {
  interface Window {
    motion: typeof motion;
  }
}
window.motion = motion;

createRoot(document.getElementById("root")!).render(
  <LazyMotion features={domAnimation}>
    <App />
  </LazyMotion>
);
