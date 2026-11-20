import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RunsPage } from '../pages/runs'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Missing root element for the Runforge application')
}

createRoot(rootElement).render(
  <StrictMode>
    <RunsPage />
  </StrictMode>,
)
