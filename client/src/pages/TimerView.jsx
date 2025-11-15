// client/src/pages/TimerView.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserContext.jsx";

export default function TimerView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { addPoints } = useUser();

  const habit = state?.habit;
  const minutes = state?.minutes ?? 20;

  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [finishedSent, setFinishedSent] = useState(false);

  if (!habit) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>No habit data</h1>
        <p>This page should be opened from a habit.</p>
        <button onClick={() => navigate("/habits")}>Back to Habits</button>
      </div>
    );
  }

  useEffect(() => {
    if (!minutes || minutes <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [minutes]);

  useEffect(() => {
    if (secondsLeft === 0 && !finishedSent) {
      handleFinished();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, finishedSent]);

  const handleCancel = () => {
    navigate(-1);
  };

  async function handleFinished() {
    if (finishedSent) return;
    setFinishedSent(true);

    alert("Timer finished! Sending to server…");
    console.log("Timer finished, calling complete endpoint with minutes:", minutes);

    try {
      const res = await fetch(`/api/habits/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Failed to complete habit. Status:",
          res.status,
          "Body:",
          text
        );
        alert(`Server error (${res.status}). Check backend logs.`);
        return;
      }

      const data = await res.json();
      console.log("Complete response:", data);

      addPoints(data.pointsEarned, data.totalPoints);

      navigate(`/habit/${id}/finished`, {
        state: {
          habit,
          minutes,
          pointsEarned: data.pointsEarned,
        },
      });
    } catch (err) {
      console.error("Error finishing timer:", err);
      alert("Network error talking to server.");
    }
  }

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{habit.title}</h1>
      <p>
        {displayMinutes}:{displaySeconds.toString().padStart(2, "0")} remaining
      </p>

      <button onClick={handleFinished} style={{ marginRight: "10px" }}>
        Finish Now
      </button>

      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}
