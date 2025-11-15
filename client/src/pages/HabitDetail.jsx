import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HabitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const passedHabit = state?.habit;
  const [habit, setHabit] = useState(passedHabit || null);
  const [loading, setLoading] = useState(!passedHabit);

  const [minutesInput, setMinutesInput] = useState("20");

  useEffect(() => {
    if (passedHabit) return;

    async function fetchHabit() {
      try {
        const res = await fetch(`/api/habits/${id}`);
        if (!res.ok) {
          setHabit(null);
        } else {
          const data = await res.json();
          setHabit(data);
        }
      } catch (err) {
        console.error("Failed to load habit:", err);
        setHabit(null);
      }
      setLoading(false);
    }

    fetchHabit();
  }, [id, passedHabit]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!habit) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Habit Not Found</h1>
        <p>This habit may have been deleted or your link is invalid.</p>
        <button onClick={() => navigate("/habits")}>Back to Habits</button>
      </div>
    );
  }

  const handleStart = () => {
    const minutes = parseInt(minutesInput, 10);

    if (!minutes || minutes <= 0) {
      alert("Please enter a valid number of minutes.");
      return;
    }

    navigate(`/habit/${habit.id}/timer`, {
      state: { habit, minutes },
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`/api/habits/${habit.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Habit deleted.");
        navigate("/habits");
      } else {
        const text = await res.text();
        console.error(
          "Failed to delete habit. Status:",
          res.status,
          "Body:",
          text
        );
        alert("Failed to delete habit. Check server logs.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error when deleting habit.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{habit.title}</h1>
      <p>{habit.description || "No description provided"}</p>

      <h2>Set Timer</h2>
      <input
        type="number"
        value={minutesInput}
        onChange={(e) => setMinutesInput(e.target.value)}
        style={{ width: "80px", marginBottom: "10px" }}
      />

      <br />

      <button onClick={handleStart} style={{ marginRight: "10px" }}>
        Start
      </button>
      <button
        onClick={() => alert("Edit screen not implemented yet")}
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        style={{ backgroundColor: "#FF8383", color: "white" }}
      >
        Delete
      </button>
    </div>
  );
}
