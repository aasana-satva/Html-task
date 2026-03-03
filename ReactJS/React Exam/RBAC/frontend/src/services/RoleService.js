const BASE_URL = "http://localhost:3001";

export const getAllUsers = async () => {
  const [usersRes, rolesRes] = await Promise.all([
    fetch(`${BASE_URL}/users`),
    fetch(`${BASE_URL}/roles`),
  ]);
  const users = await usersRes.json();
  const roles = await rolesRes.json();
  return users.map((u) => ({
    ...u,
    roleName: roles.find((r) => r.role_id === u.role_id)?.role || "Unknown",
  }));
};

export const addUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const updateUser = async (user_id, updatedData) => {
  const res = await fetch(`${BASE_URL}/users/${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};

export const deleteUser = async (user_id) => {
  await fetch(`${BASE_URL}/users/${user_id}`, { method: "DELETE" });
};