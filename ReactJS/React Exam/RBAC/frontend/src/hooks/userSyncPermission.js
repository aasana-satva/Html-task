import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice/authSlice";

const BASE_URL = "http://localhost:3001";

const useSyncPermissions = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    if (location.pathname === "/roles") return;

    const syncPermissions = async () => {
      try {
        const res   = await fetch(`${BASE_URL}/roles`);
        const roles = await res.json();

        const freshRole = roles.find((r) => r.role_id === user.role_id);
        if (!freshRole) return;

        const currentPerms = JSON.stringify(user.permissions);
        const freshPerms   = JSON.stringify(freshRole.permissions);

        if (currentPerms !== freshPerms) {
          const updatedUser = { ...user, permissions: freshRole.permissions };
          dispatch(setUser(updatedUser));
          localStorage.setItem("rbac_user", JSON.stringify(updatedUser));
        }
      } catch {
        console.error("Failed to sync permissions");
      }
    };

   
    syncPermissions();

    const interval = setInterval(syncPermissions, 0);
    return () => clearInterval(interval);

  }, [isLoggedIn, user?.role_id, location.pathname]);
};

export default useSyncPermissions;
