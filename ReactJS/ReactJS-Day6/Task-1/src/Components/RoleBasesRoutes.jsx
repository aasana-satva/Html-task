import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

function RoleBasedRoute({allowedRole,children}){
    const {user, isAuthenticated} =useSelector((state)=>state.auth);
    const [isRehydrated, setIsRehydrated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsRehydrated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isRehydrated) {
        return null;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // If user doesn't have the correct role, redirect to their appropriate dashboard
    if (user.role !== allowedRole) {
        const redirectPath = user.role === "admin" ? "/dashboard" : "/user-dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}

export default RoleBasedRoute;
