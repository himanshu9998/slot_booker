import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Welcome to <span className={styles.brand}>Slot Booker</span></h1>
        <p className={styles.description}>
          A simple tool to create events, manage time slots, and allow easy public bookings.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/signup">
            <button className={styles.primaryButton}>Sign Up</button>
          </Link>
          <Link to="/login">
            <button className={styles.secondaryButton}>Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
