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
  const [editingTag, setEditingTag] = useState(null);  // the tag being edited
  const [newName, setNewName] = useState("");

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

  // When a tag is selected for editing
  useEffect(() => {
    if (editingTag) {
      setNewName(editingTag.name);
    }
  }, [editingTag]);

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

  //functions for edit tag modal
  async function updateTag(tagId, newName) {
    try {
      const res = await fetch(`http://localhost:3001/api/tags/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
  
      if (!res.ok) throw new Error("Failed to update tag");
      
      const updatedTag = await res.json();
  
      // Update local state
      setAllTags(prev => prev.map(t => t.id === tagId ? updatedTag : t));
      setHabits(prev => prev.map(h => ({
        ...h,
        tags: h.tags?.map(ht => ht.id === tagId ? updatedTag : ht) || []
      })));
  
      // If currently filtered by this tag, update selectedTag name
      if (selectedTag === editingTag.name) {
        setSelectedTag(newName);
      }
    } catch (err) {
      alert("Failed to update tag: " + err.message);
    }
  }
  
  async function deleteTag(tagId) {
    if (!confirm("Delete this tag permanently? All habits will lose this tag.")) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/tags/${tagId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Failed to delete tag");
  
      // Remove from allTags
      setAllTags(prev => prev.filter(t => t.id !== tagId));
  
      // If we were filtering by this tag → clear filter
      if (selectedTag === editingTag.name) {
        setSelectedTag(null);
      }
  
      // Refetch habits to reflect removed tag (or filter locally)
      fetchHabits();
    } catch (err) {
      alert("Failed to delete tag: " + err.message);
    }
  }


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
        onEditTag={setEditingTag}  // open modal
      />

      { /* edit tag modal */}
      {editingTag && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditingTag(null)}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              minWidth: "320px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0" }}>Edit Tag</h3>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateTag(editingTag.id, newName)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                marginBottom: "16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              autoFocus
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setEditingTag(null)}
                style={{ padding: "8px 16px", background: "#ddd" }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (newName.trim() && newName !== editingTag.name) {
                    updateTag(editingTag.id, newName.trim());
                  }
                  setEditingTag(null);
                }}
                style={{ padding: "8px 16px", background: "#4a9ef7", color: "white" }}
              >
                Save
              </button>

              <button
                onClick={() => {
                  deleteTag(editingTag.id);
                  setEditingTag(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: "#f44",
                  color: "white",
                  marginLeft: "auto",
                }}
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      )}

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
