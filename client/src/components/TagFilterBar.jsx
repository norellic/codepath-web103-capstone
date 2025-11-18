import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TagFilterBar({ tags }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1rem",
        flexWrap: "wrap",
      }}
    >
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => navigate(`/tags/${tag.name}`)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#eee",
            cursor: "pointer",
          }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}