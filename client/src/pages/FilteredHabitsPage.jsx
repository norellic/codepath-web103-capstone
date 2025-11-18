import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FilteredHabitsPage() {
  const { tagName } = useParams();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:3001/api/habits/by-tag/${tagName}`);
      const data = await res.json();
      setHabits(data);
      setLoading(false);
    }
    load();
  }, [tagName]);

  if (loading) return <p>Loading habits…</p>;

  return (
    <div>
      <h1>Habits tagged "{tagName}"</h1>

      {habits.length === 0 && <p>No habits found.</p>}

      {habits.map(h => (
        <div key={h.id} style={{ borderBottom: "1px solid #ddd", padding: "1rem 0" }}>
          <h2>{h.title}</h2>
          <p>{h.description}</p>
        </div>
      ))}
    </div>
  );
}
