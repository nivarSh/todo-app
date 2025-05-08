import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import './index.css'
import './fanta.css'
import App from './App.jsx'
import History from "./History.jsx";

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/history" element={<History />} />
    </Routes>
  </Router>,
)
