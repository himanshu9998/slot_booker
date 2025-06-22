import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EventDetailsPage.module.css";

function EventDetailPage() {
  const { uuid } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/events/${uuid}`)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        console.error("Failed to fetch event:", err);
        setError("Event not found or failed to load.");
      });
  }, [uuid]);

  if (error) return <div className={styles.error}>{error}</div>;

  if (!event) return <div className={styles.loading}>Loading event...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.description}>{event.description}</p>
      <p className={styles.timezone}>Timezone: {event.timezone}</p>

      <h3 className={styles.subheading}>Available Slots</h3>
      <ul className={styles.slotList}>
        {event.slots.map((slot) => (
          <li key={slot.id} className={styles.slotItem}>
            <strong>{new Date(slot.datetime_utc).toLocaleString()}</strong><br />
            Max Bookings: {slot.max_bookings}<br />
            Current Bookings: {slot.current_bookings}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventDetailPage;
