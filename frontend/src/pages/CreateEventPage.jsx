// src/pages/CreateEventPage.jsx
import { useState } from "react";
import axios from "axios";

function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [slots, setSlots] = useState([{ datetime: "", max_bookings: 1 }]);

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => setSlots([...slots, { datetime: "", max_bookings: 1 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/create",
        { title, description, timezone, slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Event created!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error creating event");
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Timezone" value={timezone} readOnly />

        <h3>Time Slots</h3>
        {slots.map((slot, index) => (
          <div key={index}>
            <input
              type="datetime-local"
              value={slot.datetime}
              onChange={(e) => handleSlotChange(index, "datetime", e.target.value)}
              required
            />
            <input
              type="number"
              value={slot.max_bookings}
              onChange={(e) => handleSlotChange(index, "max_bookings", e.target.value)}
              min="1"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addSlot}>Add Slot</button>
        <br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEventPage;
