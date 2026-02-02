import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./SearchBar.css";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    const searchValue = keyword.trim().toLowerCase();
    if (!searchValue) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id")
      .ilike("search_text", `%${searchValue}%`)
      .limit(30);

    setLoading(false);

    if (error) {
      console.error("Search error:", error);
      alert("Search failed. Try again.");
      return;
    }

    if (data && data.length > 0) {
      navigate(`/search/${encodeURIComponent(searchValue)}`);
    } else {
      alert("No product found");
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search laptop accessories..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "..." : "🔍"}
      </button>
    </form>
  );
}
