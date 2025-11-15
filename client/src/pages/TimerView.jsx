import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function TimerView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  // Expecting: navigate(`/habit/${habit.id}/timer`, { state: { habit, minutes } })
  const habit = state?.habit;
  const minutes = state?.minutes ?? 20;

  // If user refreshed or came here without state, bail out nicely
  if (!habit) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>No habit data</h1>
        <p>
          This page expects to be opened from a habit. Go back to the habits
          list and try again.
        </p>
        <button onClick={() => navigate("/habits")}>Back to Habits</button>
      </div>
    );
  }

  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    // guard against weird values
    if (!minutes || minutes <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);

          // when timer finishes, go to Finished screen
          navigate(`/habit/${id}/finished`, {
            state: {
              habit,
              minutes,
              pointsEarned: minutes, // 1 point per minute (change if needed)
            },
          });

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [id, minutes, habit, navigate]);

  const handleCancel = () => {
    navigate(-1); // back to HabitDetail
  };

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{habit.title}</h1>
      <p>
        {displayMinutes}:{displaySeconds.toString().padStart(2, "0")} remaining
      </p>

      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}
