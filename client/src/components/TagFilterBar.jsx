export default function TagFilterBar({ allTags, selectedTag, onSelectTag, onEditTag }) {
  return (
    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
      {/* All Button */}
      <button
        onClick={() => onSelectTag(null)}
        style={{
          backgroundColor: selectedTag ? "#ddd" : "#aaa",
          padding: "0.5rem 1rem",
        }}
      >
        All
      </button>

      {allTags.map(tag => (
        <div key={tag.id} style={{ display: "inline-flex" }}>
          {/* Filter Button */}
          <button
            onClick={() => onSelectTag(prev => (prev === tag.name ? null : tag.name))}
            style={{
              padding: "0.5rem 0.5rem",
              backgroundColor: selectedTag === tag.name ? "#8af" : "#eef",
              border: "1px solid #ccc",
              borderRight: "0",
              marginRight: 0,
              borderRadius: "5px 0 0 5px",
              cursor: "pointer",
            }}
          >
            {tag.name}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEditTag(tag)}
            style={{
              padding: "0.5rem 0.5rem",
              backgroundColor: "#ccc",
              border: "1px solid #ccc",
              borderLeft: "0",
              marginLeft: 0,
              borderRadius: "0 5px 5px 0",
              cursor: "pointer",
            }}
          >
            ✏️
          </button>
        </div>
      ))}
    </div>
  );
}
