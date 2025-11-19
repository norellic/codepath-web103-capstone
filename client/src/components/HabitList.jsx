import React from "react";

export default function HabitList({ habits, onSelect }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {habits.length === 0 && <li>No habits yet.</li>}

      {habits.map((h) => (
        <li
          key={h.id}
          onClick={() => onSelect(h)}
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
  );
}
