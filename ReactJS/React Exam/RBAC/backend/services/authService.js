// backend/services/authService.js
// This file handles authentication logic on the backend side
// It talks to db.json through json-server API

const BASE_URL = "http://localhost:3001";

// Login: Find user by email and password, then fetch their role + permissions
export const loginUser = async (email, password) => {
  // Step 1: Fetch all users from json-server
  const usersRes = await fetch(`${BASE_URL}/users`);
  const users = await usersRes.json();

  // Step 2: Find matching user
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");

  // Step 3: Fetch this user's role (to get permissions)
  const rolesRes = await fetch(`${BASE_URL}/roles`);
  const roles = await rolesRes.json();
  const role = roles.find((r) => r.role_id === user.role_id);

  // Step 4: Return combined user + role info
  return { ...user, roleName: role.role, permissions: role.permissions };
};