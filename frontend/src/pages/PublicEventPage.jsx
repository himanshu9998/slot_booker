import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link
import axios from 'axios';
import styles from './PublicEventsPage.module.css';

function PublicEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/public`)
      .then(res => setEvents(res.data.events))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Public Events</h2>
      <ul className={styles.eventList}>
        {events.map(event => (
          <li key={event.uuid} className={styles.eventItem}>
            {/* ✅ use Link to enable SPA navigation */}
            <Link to={`/events/${event.uuid}`} className={styles.eventLink}>
              {event.title}
            </Link>
            <span className={styles.eventDescription}> — {event.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PublicEventsPage;
