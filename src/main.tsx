import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { PortalDataProvider } from './context/PortalDataContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PortalDataProvider>
        <App />
      </PortalDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
