// src/pages/CreateEventPage.jsx
import { useState } from "react";
import axios from "axios";
import styles from "./CreateEventPage.module.css";

function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [slots, setSlots] = useState([
    { datetime: "", max_bookings: 1 },
  ]);
  const [msg, setMsg] = useState("");

  /* ---------- helpers ---------- */
  const handleSlotChange = (idx, field, value) => {
    setSlots((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      )
    );
  };

  const addSlot = () =>
    setSlots((prev) => [...prev, { datetime: "", max_bookings: 1 }]);

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("Please log in first.");
      return;
    }

    // transform datetimes & ensure numbers
    const processedSlots = slots.map((s) => ({
      datetime: new Date(s.datetime).toISOString(),
      max_bookings: Number(s.max_bookings),
    }));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events/create`,
        { title, description, timezone, slots: processedSlots },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);
      setMsg("✅ Event created!");
      // optional – reset form
      setTitle("");
      setDescription("");
      setSlots([{ datetime: "", max_bookings: 1 }]);
    } catch (err) {
      console.error(err);
      setMsg(
        err.response?.data?.error ||
          "Event creation failed. Check console."
      );
    }
  };

  /* ---------- render ---------- */
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
                handleSlotChange(i, "max_bookings", Number(e.target.value))
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
