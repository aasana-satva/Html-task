import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

const ProtectedRoute = ({ module, children }) => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const token = localStorage.getItem("rbac_token");

  useEffect(() => {
    if (!token && isLoggedIn) {
      dispatch(logout());
    }

    const handleStorageChange = () => {
      const currentToken = localStorage.getItem("rbac_token");
      if (!currentToken && isLoggedIn) {
        dispatch(logout());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token, isLoggedIn, dispatch]);

  if (!isLoggedIn || !token) return <Navigate to="/login" replace />;

  if (module) {
    const canView = user?.permissions?.[module]?.includes("view") || false;
    if (!canView) return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;