import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import "./style.css";

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return <RouterProvider router={router} />;
}
