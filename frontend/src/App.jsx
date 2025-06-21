import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create" element={<CreateEventPage />} />
        <Route path="/events/:uuid" element={<EventDetailsPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
