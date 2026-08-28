import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function fetchPeerNetwork(studentId) {
  const response = await api.get(`/peers/${studentId}`);
  return response.data;
}

export async function fetchPrerequisites(code) {
  const response = await api.get(`/prerequisites/${code}`);
  return response.data;
}

export async function fetchAllSubjectsWithPrerequisites() {
  const response = await api.get("/subjects/prerequisites");
  return response.data;
}