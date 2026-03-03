import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRehydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isRehydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
