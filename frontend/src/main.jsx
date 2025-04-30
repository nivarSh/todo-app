import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fanta.css'
import AppRouter from './Router.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
