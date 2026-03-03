// backend/services/projectService.js
// Handles all CRUD operations for Projects

const BASE_URL = "http://localhost:3001";

export const getAllProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`);
  return res.json();
};

export const addProject = async (projectData) => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  return res.json();
};

export const updateProject = async (project_id, updatedData) => {
  const res = await fetch(`${BASE_URL}/projects/${project_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};

export const deleteProject = async (project_id) => {
  await fetch(`${BASE_URL}/projects/${project_id}`, { method: "DELETE" });
};