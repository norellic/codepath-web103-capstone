// components/TagFilterBar.jsx
export default function TagFilterBar({ 
  allTags, 
  selectedTag, 
  onSelectTag,
  onEditTag,  //opens modal
  onDeleteTag  // optional: immediate delete, but we'll use modal
}) {
  return (
    <div style={{ 
      display: "flex", 
      gap: "0.25rem", 
      marginBottom: "1rem", 
      flexWrap: "wrap" 
    }}>
      {/* All Button */}
      <button
        onClick={() => onSelectTag(null)}
        style={{
          backgroundColor: selectedTag ? "#ddd" : "#aaa",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        All
      </button>

      {allTags.map(tag => (
        <div key={tag.id} style={{ display: "inline-flex" }}>
          {/* Filter Button */}
          <button
            onClick={() => onSelectTag(selectedTag === tag.name ? null : tag.name)}
            style={{
              padding: "0.5rem 0.75rem",
              backgroundColor: selectedTag === tag.name ? "#8af" : "#eef",
              border: "1px solid #ccc",
              borderRight: "none",
              marginRight: 0,
              borderRadius: "5px 0 0 5px",
              cursor: "pointer",
            }}
          >
            {tag.name}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEditTag(tag)}  // ← triggers modal in parent
            style={{
              padding: "0.5rem 0.5rem",
              backgroundColor: "#ccc",
              border: "1px solid #ccc",
              borderLeft: "none",
              marginLeft: 0,
              borderRadius: "0 5px 5px 0",
              cursor: "pointer",
            }}
            title="Edit tag"
          >
            ✏️
          </button>
        </div>
      ))}
    </div>
  );
}