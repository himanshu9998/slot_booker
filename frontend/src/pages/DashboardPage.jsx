// src/pages/DashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/create"); // You can customize this route
  };

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <button onClick={handleCreateEvent}>Create New Event</button>
    </div>
  );
};

export default DashboardPage;
