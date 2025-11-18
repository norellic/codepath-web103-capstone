import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HabitForm from "../components/HabitForm";

export default function EditHabit() {
  const { id } = useParams(); // habit id from URL
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [selectedTags, setSelectedTags] = useState(habit?.tags || []);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch habit data and all tags
  useEffect(() => {
    async function fetchData() {
      try {
        // fetch habit
        const habitRes = await fetch(`http://localhost:3001/api/habits/${id}`);
        if (!habitRes.ok) throw new Error("Failed to load habit");
        const habitData = await habitRes.json();

        // fetch tags for habit
        const tagsRes = await fetch(`http://localhost:3001/api/tags/${id}`);
        if (!tagsRes.ok) throw new Error("Failed to load tags");
        const tagsData = await tagsRes.json();

        //fetch all tags
        const allTagsRes = await fetch(`http://localhost:3001/api/tags`);
        if (!allTagsRes.ok) throw new Error("Failed to load tags");
        const allTagsData = await allTagsRes.json();

        setHabit(habitData);
        setSelectedTags(tagsData);
        setAllTags(allTagsData)
      } catch (err) {
        console.error(err);
        alert("Error loading habit data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      const res = await fetch(`http://localhost:3001/api/habits/${id}`, {
        method: "PUT", // assuming your backend uses PUT for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to update habit");
        return;
      }

      const updatedHabit = await res.json();
      alert("Habit updated successfully!");
      navigate(`/habit/${updatedHabit.id}`); // navigate to habit detail page
    } catch (err) {
      console.error("Error updating habit:", err);
      alert("Something went wrong updating the habit.");
    }
  };

  if (loading) return <div>Loading habit...</div>;
  if (!habit) return <div>Habit not found.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Habit</h1>
      <HabitForm
        initialValues={{
          title: habit.title,
          description: habit.description,
          tags: selectedTags?.map(t => t.name) || [] // ensure array of strings
        }}
        allTags={allTags}
        onSubmit={handleUpdate}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
