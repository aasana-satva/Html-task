import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { searchReducer, initialState } from "./searchReducer";
import "./style.css";

function SearchPage() {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query) return;

    dispatch({ type: "FETCH_START" });

    try {
      const res = await fetch(
        `https://jsonplaceholder.typi897987code.com/users?q=${query}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });

    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  return (
    <div className="container">
      <h2>User Directory</h2>

      <input
        type="text"
        placeholder="Search user..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {state.loading && <p className="loading">Loading...</p>}

      {state.error && <p className="error">{state.error}</p>}

      {state.data.map((user) => (
        <div
          key={user.id}
          className="card"
          onClick={() => navigate(`/user/${user.id}`)}
        >
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchPage;
