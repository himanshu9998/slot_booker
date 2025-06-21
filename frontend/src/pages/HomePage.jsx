import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Slot Booker</h1>
      <p style={{ fontSize: "18px", marginTop: "10px" }}>
        A simple tool to create events, manage time slots, and allow easy public bookings.
      </p>

      <div style={{ marginTop: "30px" }}>
        <Link to="/signup">
          <button style={{ marginRight: "20px", padding: "10px 20px", fontSize: "16px" }}>Sign Up</button>
        </Link>
        <Link to="/login">
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>Log In</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
