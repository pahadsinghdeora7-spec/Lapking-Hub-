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

    if (!keyword.trim()) return;

    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("id")
      .ilike("search_text", `%${keyword.toLowerCase()}%`)
      .limit(30);

    setLoading(false);

    if (data && data.length > 0) {
      navigate(`/search/${encodeURIComponent(keyword)}`);
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

      <button type="submit">
        {loading ? "..." : "🔍"}
      </button>
    </form>
  );
}
