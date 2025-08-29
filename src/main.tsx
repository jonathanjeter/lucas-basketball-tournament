import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { initializeEmailJS, debugEmailConfig } from './lib/email'
import './index.css'
import App from './App.tsx'

// Initialize EmailJS when app starts
debugEmailConfig()
initializeEmailJS()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}>
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
)
