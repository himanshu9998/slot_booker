import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/events`)
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upcoming Events</h2>
      {events.length === 0 && <p>No events found.</p>}
      {events.map(event => (
        <div key={event.id} style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0" }}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>Time Zone:</strong> {event.timezone}</p>
          <p><strong>Created By:</strong> {event.creatorEmail}</p>
          <Link to={`/events/${event.uuid}`}>View & Book Slots</Link>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
