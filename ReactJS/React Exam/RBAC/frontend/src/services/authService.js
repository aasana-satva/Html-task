import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:3001";

// Simple JWT-like token generator (for frontend use with json-server)
const generateToken = (user) => {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    role_id: user.role_id,
    timestamp: Date.now(),
  };
  // Create a base64 encoded token (simple implementation)
  return btoa(JSON.stringify(payload));
};

export const loginUser = async (email, password) => {
  const usersRes = await fetch(`${BASE_URL}/users`);
  const users = await usersRes.json();

  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Invalid email or password");

  // Compare password with bcrypt
  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } catch (e) {
    // If bcrypt compare fails (e.g., old plain text password), try plain text comparison
    isPasswordValid = password === user.password;
  }
  if (!isPasswordValid) throw new Error("Invalid email or password");

  const rolesRes = await fetch(`${BASE_URL}/roles`);
  const roles = await rolesRes.json();
  const role = roles.find((r) => r.role_id === user.role_id);

  // Generate JWT token
  const token = generateToken(user);

  return { 
    ...user, 
    roleName: role.role, 
    permissions: role.permissions,
    token 
  };
};
