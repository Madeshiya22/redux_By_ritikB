import axios from "axios";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001/api/auth";

const authClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle 401 (token expired)
authClient.interceptors.response.use(
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

export const registerUser = async (payload) => {
  const response = await authClient.post("/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await authClient.post("/login", payload);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await authClient.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};