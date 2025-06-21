import { useEffect, useState } from 'react';
import axios from 'axios';

function PublicEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/public')
      .then(res => setEvents(res.data.events))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  return (
    <div>
      <h2>Public Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.uuid}>
            <a href={`/event/${event.uuid}`}>{event.title}</a> — {event.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PublicEventsPage;
