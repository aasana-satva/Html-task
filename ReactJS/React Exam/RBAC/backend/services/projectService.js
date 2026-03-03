import axios from "axios";

const API_URL = "http://localhost:5000/projects";

export const getProjects = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const addProject = async (project) => {
  const { data } = await axios.post(API_URL, project);
  return data;
};

export const updateProject = async (id, updatedData) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, updatedData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};