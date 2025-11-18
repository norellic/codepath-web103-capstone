import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HabitForm from "../components/HabitForm";
import TagFilterBar from "../components/TagFilterBar";

export default function Habits() {
  const navigate = useNavigate();

  //habit + form states
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  //tags states
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  //fetch all user tags
  useEffect(() => {
    async function fetchTags() {
      const res = await fetch("http://localhost:3001/api/tags");
      const data = await res.json();
      setAllTags(data);
    }
    fetchTags();
  }, []);

  //fetch all habits
  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch("http://localhost:3001/api/habits");
        const data = await res.json();
        setHabits(data);
      } catch (err) {
        console.error("Failed to load habits", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading habits...</div>;
  }

  //habit form
  return (

    <div style={{ padding: "20px" }}>

      <h1>Your Habits</h1>
      <p>Track and manage your daily habits here!</p>

      <TagFilterBar tags={allTags} />

      <button onClick={() => setShowForm(true)} style={{ marginBottom: "10px" }}>
        +
      </button>

      {showForm && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Create Habit</h2>
          <HabitForm
            allTags={allTags}
            onSubmit={async (data) => {
              try {
                const res = await fetch("http://localhost:3001/api/habits", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });

                if (!res.ok) {
                  const errData = await res.json().catch(() => ({}));
                  alert(errData.error || "Failed to create habit");   
                  return;
                }

                const newHabit = await res.json();
                setHabits(prev => [newHabit, ...prev]);
                setShowForm(false);
              } catch (err) {
                console.error("Error creating habit", err);
                alert("Something went wrong creating the habit.");
              }
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* this displays previous habits*/}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.length === 0 && <li>No habits yet.</li>}

        {habits.map((h) => (
          <li
            key={h.id}
            onClick={() => navigate(`/habit/${h.id}`, { state: { habit: h } })}
            style={{
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <strong>{h.title}</strong> – {h.description || "No description"}
            <br />
            <small>
              Created:{" "}
              {h.created_at
                ? new Date(h.created_at).toLocaleString()
                : "Unknown"}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
