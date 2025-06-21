import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetailsPage = () => {
  const { uuid } = useParams();
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [booking, setBooking] = useState({ name: '', email: '', slotId: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${uuid}`);
setEvent({
  title: res.data.title,
  description: res.data.description,
  timezone: res.data.timezone,
  uuid: res.data.uuid,
});
setSlots(res.data.slots);

      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [uuid]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`http://localhost:5000/api/bookings/${booking.slotId}`, {
        name: booking.name,
        email: booking.email,
      });
      setMessage('Booking successful!');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Booking failed.');
      }
    }
  };

  return (
    <div className="container">
      {event ? (
        <>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <h3>Available Time Slots</h3>
          <ul>
            {slots.map((slot) => (
              <li key={slot.id}>
                <label>
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    onChange={() => setBooking({ ...booking, slotId: slot.id })}
                  />
                  {new Date(slot.datetime_utc).toLocaleString()} (Available)
                </label>
              </li>
            ))}
          </ul>

          <form onSubmit={handleBookingSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={booking.name}
              onChange={(e) => setBooking({ ...booking, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={booking.email}
              onChange={(e) => setBooking({ ...booking, email: e.target.value })}
              required
            />
            <button type="submit" disabled={!booking.slotId}>Book Slot</button>
          </form>

          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Loading event...</p>
      )}
    </div>
  );
};

export default EventDetailsPage;
