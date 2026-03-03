import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import ProtectedRoute from "./Components/ProtectedRoutes";
import RoleBasedRoute from "./Components/RoleBasesRoutes";
import Layout from "./Components/Layout";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function CatchAll() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRehydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isRehydrated) {
    return null;
  }

  if (isAuthenticated && user) {
    const redirectPath = user.role === "admin" ? "/dashboard" : "/user-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <RoleBasedRoute allowedRole="admin">
                <AdminDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/user-dashboard",
            element: (
              <RoleBasedRoute allowedRole="user">
                <UserDashboard />
              </RoleBasedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <CatchAll />,
  },
]);

export default router;
