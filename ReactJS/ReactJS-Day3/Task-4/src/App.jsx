import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./searchPage";
import UserDetail from "./UserDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
