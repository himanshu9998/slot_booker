// src/pages/DashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/create");
  };

  const handlePublicEvent = () => {
    navigate("/public");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome to your Dashboard!</h1>
      <div className={styles.buttonList}>
        <button className={styles.button} onClick={handleCreateEvent}>
          Create New Event
        </button>
        <button className={styles.button} onClick={handlePublicEvent}>
          Active Events
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
