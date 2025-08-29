// API functions for communicating with the Node.js backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const getFundraisingStatsFromBackend = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const getTeamsFromBackend = async () => {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const getSponsorsFromBackend = async () => {
  const response = await fetch(`${API_BASE_URL}/sponsors`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const getBracketsFromBackend = async () => {
  const response = await fetch(`${API_BASE_URL}/brackets`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};