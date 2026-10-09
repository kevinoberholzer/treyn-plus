import React from 'react'
import ReactDOM from 'react-dom/client'
// Schrift Inter selbst gehostet (keine Verbindung zu Google Fonts), gleiche Schnitte wie bisher
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
