import { useState } from "react";
import axios from "axios";
import styles from "./CreateEventPage.module.css";

function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [slots, setSlots] = useState([{ datetime: "", max_bookings: 1 }]);
  const [msg, setMsg] = useState("");

  const handleSlotChange = (i, field, value) =>
    setSlots((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );

  const addSlot = () =>
    setSlots((prev) => [...prev, { datetime: "", max_bookings: 1 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setMsg("Please log in first.");

    const processedSlots = slots.map((s) => {
      const raw = s.datetime; // "YYYY-MM-DDTHH:MM"
      const iso = raw.length === 16 ? `${raw}:00` : raw; // add seconds
      return { datetime: iso, max_bookings: Number(s.max_bookings) };
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events/create`,
        { title, description, timezone, slots: processedSlots },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Event created!");
      setTitle("");
      setDescription("");
      setSlots([{ datetime: "", max_bookings: 1 }]);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || "Event creation failed.");
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
          value={timezone}
          readOnly
        />
        <h3 className={styles.subheading}>Time Slots</h3>
        {slots.map((slot, i) => (
          <div key={i} className={styles.slotRow}>
            <input
              type="datetime-local"
              className={styles.input}
              value={slot.datetime}
              onChange={(e) =>
                handleSlotChange(i, "datetime", e.target.value)
              }
              required
            />
            <input
              type="number"
              min="1"
              className={styles.input}
              value={slot.max_bookings}
              onChange={(e) =>
                handleSlotChange(i, "max_bookings", e.target.value)
              }
              required
            />
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={addSlot}
        >
          Add Slot
        </button>
        <button type="submit" className={styles.submitButton}>
          Create Event
        </button>
        {msg && <p className={styles.message}>{msg}</p>}
      </form>
    </div>
  );
}

export default CreateEventPage;
