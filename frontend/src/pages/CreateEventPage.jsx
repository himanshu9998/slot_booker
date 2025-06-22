import { useState } from "react";
import axios from "axios";
import styles from "./CreateEventPage.module.css";

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
        "`${import.meta.env.VITE_API_BASE_URL}/api/create",
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
    <div className={styles.container}>
      <h2 className={styles.heading}>Create New Event</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Timezone"
          value={timezone}
          readOnly
        />

        <h3 className={styles.subheading}>Time Slots</h3>
        {slots.map((slot, index) => (
          <div key={index} className={styles.slotRow}>
            <input
              className={styles.input}
              type="datetime-local"
              value={slot.datetime}
              onChange={(e) => handleSlotChange(index, "datetime", e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="number"
              value={slot.max_bookings}
              onChange={(e) => handleSlotChange(index, "max_bookings", e.target.value)}
              min="1"
              required
            />
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={addSlot}>
          Add Slot
        </button>
        <br />
        <button type="submit" className={styles.submitButton}>Create Event</button>
      </form>
    </div>
  );
}

export default CreateEventPage;
