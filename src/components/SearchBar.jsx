import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const cleanQuery = normalize(query);

    if (!cleanQuery) return;

    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search by name, part no, brand, model..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button type="submit" aria-label="Search">
        🔍
      </button>
    </form>
  );
}
