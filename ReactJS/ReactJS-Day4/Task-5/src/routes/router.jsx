import { createBrowserRouter } from "react-router-dom";
import CounterPage from "../pages/CounterPage";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <CounterPage />
    },
]);