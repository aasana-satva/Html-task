import { createBrowserRouter } from "react-router-dom";
import InventoryPage from "../pages/InventoryPage";

export const router = createBrowserRouter([
    {
        path :"/",
        element : <InventoryPage />
    },
]);