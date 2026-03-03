import { createSlice } from "@reduxjs/toolkit";

// Try to load user from localStorage (so login persists on refresh)
const savedUser = localStorage.getItem("rbac_user")
  ? JSON.parse(localStorage.getItem("rbac_user"))
  : null;

// Get token from localStorage
const savedToken = localStorage.getItem("rbac_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,       // The logged-in user object (with permissions)
    token: savedToken,     // JWT token
    isLoggedIn: !!savedUser,
  },
  reducers: {
    // Called after successful login
    setUser: (state, action) => {
  state.user       = action.payload;
  state.isLoggedIn = true;
  // ✅ Only update token if it exists in payload, keep existing token otherwise
  if (action.payload.token) {
    state.token = action.payload.token;
    localStorage.setItem("rbac_token", action.payload.token);
  }
  localStorage.setItem("rbac_user", JSON.stringify(action.payload));
},
    // Called on logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("rbac_user");
      localStorage.removeItem("rbac_token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
