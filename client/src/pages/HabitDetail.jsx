import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function HabitDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  // habit passed from Habits.jsx navigate(`/habit/${h.id}`, { state: { habit: h } })
  const habit = state?.habit;

  const [minutesInput, setMinutesInput] = useState("20"); // default 20

  if (!habit) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Habit not found</h1>
        <button onClick={() => navigate("/habits")}>Back to Habits</button>
      </div>
    );
  }


  // timer minutes state
  const handleStart = () => {
    // convert string -> number ONLY when starting
    const minutes = parseInt(minutesInput, 10);

    if (!minutes || minutes <= 0) {
      alert("Please enter a valid number of minutes.");
      return;
    }

    navigate(`/habit/${habit.id}/timer`, {
      state: { habit, minutes },
    });
  };

  const handleDelete = () => {
    alert("Delete habit will be implemented later.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{habit.title}</h1>
      <p>{habit.description || "No description provided"}</p>
      <p>
        <small>Created: {habit.created_at}</small>
      </p>

      <h2>Set Timer</h2>

      <input
        type="number"
        value={minutesInput}
        onChange={(e) => setMinutesInput(e.target.value)}
        style={{ width: "100px", marginBottom: "10px" }}
      />

      <br />

      <button onClick={handleStart} style={{ marginRight: "10px" }}>
        Start
      </button>

      <button
        onClick={() => alert("Edit not implemented yet")}
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>

      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete
      </button>
    </div>
  );
}
