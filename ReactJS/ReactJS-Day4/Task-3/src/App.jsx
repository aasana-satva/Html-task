import React from "react";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import MovieSearch from "./components/MovieSearch";
import "antd/dist/reset.css";

function App() {
  return(
    <Provider store={store}>
      <div style={{minHeight: "100vh", background: "#f5f5f5"}}>
        <MovieSearch />
      </div>
    </Provider>
  );
}

export default App;
