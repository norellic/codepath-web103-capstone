export default function TagFilterBar({ allTags, selectedTag, onSelectTag }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {/* Clear Button */}
      <button
        onClick={() => onSelectTag(null)}
        style={{
          backgroundColor: selectedTag ? "#ddd" : "#aaa",
          padding: "0.5rem 1rem",
        }}
      >
        All
      </button>

      {/* Tag Buttons */}
      {allTags.map(tag => (
        <button
          key={tag.id}
          onClick={() =>
            onSelectTag(prev => (prev === tag.name ? null : tag.name))
          }
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: selectedTag === tag.name ? "#8af" : "#eef",
          }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
