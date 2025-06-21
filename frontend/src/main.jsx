// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Signup from './pages/SignupPage.jsx' // Assuming this file is already here
import LoginPage from './pages/LoginPage.jsx'//;
import VerifyEmail from './pages/VerifyEmailPage.jsx'//;
import DashboardPage from './pages/DashboardPage.jsx'//;
import Create from './pages/CreateEventPage.jsx'//;
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
