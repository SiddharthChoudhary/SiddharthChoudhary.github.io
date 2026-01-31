import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Vendor CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'boxicons/css/boxicons.min.css'
import 'swiper/css/bundle'
import 'glightbox/dist/css/glightbox.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// App styles
import './index.css'
import './styles/style.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
