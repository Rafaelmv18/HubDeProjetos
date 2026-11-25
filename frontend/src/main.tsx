import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* O BrowserRouter liga o React à barra de endereço do navegador */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
