import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import SmartCounter from './Component/SmartCounter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SmartCounter />
  </StrictMode>,
)
