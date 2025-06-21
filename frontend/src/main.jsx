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
import Public from './pages/PublicEventPage.jsx'//;
import EventDetails from './pages/EventDetailsPage.jsx'//;
import HomePage from './pages/HomePage.jsx'//;
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
        <Route path="/public" element={<Public />} />
        <Route path="/event/:uuid" element={<EventDetails />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
