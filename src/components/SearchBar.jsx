import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./SearchBar.css";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 normalize function (MOST IMPORTANT)
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""); // remove all special characters
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) return;

    setLoading(true);

    // ✅ normalize user input
    const normalized = normalizeText(keyword);

    const { data, error } = await supabase
      .from("products")
      .select("id")
      .ilike("search_text", `%${normalized}%`)
      .limit(30);

    setLoading(false);

    if (error) {
      console.error("Search error:", error);
      alert("Search error");
      return;
    }

    if (data && data.length > 0) {
      navigate(`/search/${encodeURIComponent(normalized)}`);
    } else {
      alert("No product found");
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search laptop accessories, model, part number..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "..." : "🔍"}
      </button>
    </form>
  );
}
