import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeFirebaseAnalytics } from './firebaseAnalytics'

import './index.css'
import './styles/style.css'
import App from './App.jsx'

initializeFirebaseAnalytics().catch(() => {
  // Keep app startup resilient if analytics initialization fails.
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
