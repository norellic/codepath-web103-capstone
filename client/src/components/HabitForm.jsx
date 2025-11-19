// HabitForm.jsx
import { useState } from "react";

export default function HabitForm({ 
  initialValues = { title: "", description: "", tags: [] }, 
  allTags = [], 
  onSubmit, 
  onCancel 
}) {
  const [form, setForm] = useState({
    title: initialValues.title, 
    description: initialValues.description
  });
  const [selectedTags, setSelectedTags] = useState(initialValues.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!tagInput.trim()) return;
      const cleaned = tagInput.trim().toLowerCase();
      if (!selectedTags.includes(cleaned)) {
        setSelectedTags(prev => [...prev, cleaned]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const toggleExistingTag = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(prev => prev.filter(t => t !== tagName));
    } else {
      setSelectedTags(prev => [...prev, tagName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Please enter a title.");
    onSubmit({ ...form, tags: selectedTags });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Habit title"
        />
      </label>
      <br />
      <label>
        Description:
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
        />
      </label>
      <br />
      <label>
        Tags:
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag and press Enter"
        />
      </label>

      <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {selectedTags.map(tag => (
          <span
            key={tag}
            style={{
              padding: "5px 10px",
              background: "#ddd",
              borderRadius: "15px",
              cursor: "pointer"
            }}
            onClick={() => removeTag(tag)}
          >
            {tag} ×
          </span>
        ))}
      </div>

      <h4>Available Tags</h4>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {allTags.map((tag) => (
            <span
            key={tag.id}
            onClick={() => toggleExistingTag(tag.name)}
            style={{
                padding: "5px 10px",
                borderRadius: "15px",
                cursor: "pointer",
                background: selectedTags.includes(tag.name)
                ? "#90ee90" // green if selected
                : "#eee",
            }}
            >
            {tag.name}
            </span>
        ))}
        </div>

      <br />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
