
const BASE_URL = "http://localhost:3001";

// Get all roles with their permissions
export const getAllRoles = async () => {
  const res = await fetch(`${BASE_URL}/roles`);
  return res.json();
};

// Update permissions for a specific role (only Admin can do this)
export const updateRolePermissions = async (role_id, permissions) => {
  // First get the existing role data
  const res = await fetch(`${BASE_URL}/roles/${role_id}`);
  const existingRole = await res.json();

  // Then update just the permissions field
  const updateRes = await fetch(`${BASE_URL}/roles/${role_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...existingRole, permissions }),
  });
  return updateRes.json();
};