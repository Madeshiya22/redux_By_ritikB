import axios from "axios";

const NOTES_API_URL = import.meta.env.VITE_NOTES_API_URL || "http://localhost:3001/api/notes";

const noteClient = axios.create({
  baseURL: NOTES_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

noteClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle 401 (token expired)
noteClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized (token expired), clear localStorage and reload
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Reload page to show login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const fetchNotes = async () => {
  const response = await noteClient.get("");
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await noteClient.post("", noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await noteClient.put(`/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await noteClient.delete(`/${id}`);
  return response.data;
};
