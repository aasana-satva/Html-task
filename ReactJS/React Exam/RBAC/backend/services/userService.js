// backend/services/userService.js
// Handles all CRUD operations for Users

const BASE_URL = "http://localhost:3001";

// Get all users (with their role names)
export const getAllUsers = async () => {
  const [usersRes, rolesRes] = await Promise.all([
    fetch(`${BASE_URL}/users`),
    fetch(`${BASE_URL}/roles`),
  ]);
  const users = await usersRes.json();
  const roles = await rolesRes.json();

  // Attach role name to each user
  return users.map((user) => {
    const role = roles.find((r) => r.role_id === user.role_id);
    return { ...user, roleName: role ? role.role : "Unknown" };
  });
};

// Add a new user
export const addUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

// Update a user by user_id
export const updateUser = async (user_id, updatedData) => {
  const res = await fetch(`${BASE_URL}/users/${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};

// Delete a user by user_id
export const deleteUser = async (user_id) => {
  await fetch(`${BASE_URL}/users/${user_id}`, { method: "DELETE" });
};