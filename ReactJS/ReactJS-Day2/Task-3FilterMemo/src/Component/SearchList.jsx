import { useMemo, useState, useEffect } from "react";
import "./SearchList.css";

const bigList = Array.from({ length: 5000 }, (_, i) => `Search for Item ${i + 1}`);

function SearchList() {
  const [searchTerm, setSearhTerm] = useState("");
  const [darkMode, setDarckMode] = useState(false);

  const filterItems = useMemo(() => {
    console.log("Filter running");
    return bigList.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  useEffect(() => {
    if (darkMode) {
      document.body.className = "dark";
    } else {
      document.body.className = "light";
    }
  }, [darkMode]);

  return (
      <div className="container">

      <nav className="navbar">
  <h1 className="logo-text">Massive List Search</h1>
  <button onClick={() => setDarckMode(!darkMode)}>
    Toggle Theme
  </button>
</nav>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearhTerm(e.target.value)}
        />
      </div>

      <ul>
        {filterItems.slice(0, 5000).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>
  );
}

export default SearchList;
