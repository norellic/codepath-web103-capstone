import { useState } from "react";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Please enter a title.");
    const newHabit = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      created_at: new Date().toLocaleString(),
    };
    setHabits((prev) => [newHabit, ...prev]);
    setForm({ title: "", description: "" });
    setShowForm(false);
  };

  return (
    <div>
      <h1>Your Habits</h1>
      <p>Track and manage your daily habits here!</p>
      <button onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div>
          <h2>Create Habit</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Habit title"
              />
            </label>
            <br />
            <label>
              Description:
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </label>
            <br />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <ul>
        {habits.length === 0 && <li>No habits yet.</li>}
        {habits.map((h) => (
          <li key={h.id}>
            <strong>{h.title}</strong> – {h.description || "No description"}  
            <br />
            Created: {h.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}
