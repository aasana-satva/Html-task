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
  // Fetch existing users to get the max user_id
  const usersRes = await fetch(`${BASE_URL}/users`);
  const users = await usersRes.json();
  
  // Calculate the next user_id
  const maxUserId = users.reduce((max, user) => 
    (user.user_id > max ? user.user_id : max), 0);
  const newUserId = maxUserId + 1;
  
  // Include both user_id and id (for json-server compatibility)
  const userWithId = {
    ...userData,
    user_id: newUserId,
    id: newUserId
  };
  
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userWithId),
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