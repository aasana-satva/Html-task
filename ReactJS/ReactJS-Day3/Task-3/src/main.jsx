import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import LiveNews from './Components/LiveNews.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LiveNews />
  </StrictMode>,
)
