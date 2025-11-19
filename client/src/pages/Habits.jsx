import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TagFilterBar from "../components/TagFilterBar";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";

export default function Habits() {
  const navigate = useNavigate();

  //habit + form states
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  //tags states
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  //standalone func since I need it in two use effect functions
  //and therefore cannot define it in either one
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

  //fetch all habits
  useEffect(() => {
    fetchHabits();
  }, []);

  //fetch all user tags
  useEffect(() => {
    async function fetchTags() {
      const res = await fetch("http://localhost:3001/api/tags");
      const data = await res.json();
      setAllTags(data);
    }
    fetchTags();
  }, []);

  //controls whether habit list gets filtered list or all habits
  useEffect(() => {
    async function loadFiltered() {
      if (!selectedTag) return; // no filter → show all
  
      const res = await fetch(`http://localhost:3001/api/habits/by-tag/${selectedTag}`);
      const data = await res.json();
      setHabits(data);
    }
  
    if (selectedTag) {
      loadFiltered();
    } else {
      fetchHabits();
    }
  }, [selectedTag]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading habits...</div>;
  }
 
  return (

    <div style={{ padding: "20px" }}>

      <h1>Your Habits</h1>
      <p>Track and manage your daily habits here!</p>

      <TagFilterBar
        allTags={allTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />  

      { /* habit form*/}
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

      <HabitList
        habits={habits}
        onSelect={(habit) =>
          navigate(`/habit/${habit.id}`, { state: { habit } })
        }
      />
    </div>
  );
}
